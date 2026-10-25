---
title: " 1Password 免费平替方案，手把手教你自建 Vaultwarden 密码管理器"
date: "2026-10-25"
category: "教程"
---
大家好，我是齐昂！

> **重要提示**
> 本手册不绑定任何云厂商、域名商或已有配置。文中域名统一用占位符 `vault.example.com`，动手前把它们全局替换成自己的值。我自己的环境信息只作为个别步骤的示例出现，不构成主线。

## 前言

不知道大家平时是怎么管理自己的各种密码的，可能在用 1Password 这类商业密码管理器，也可能跟我一样，长期靠脑子和备忘录硬扛。我自己的密码，一直处在「能用就行」的状态：一部分写在纸质本子上，一部分记在 Mac 自带的备忘录里。找一条密码，得先回忆它存在哪边；改一条密码，还得记得两处同步。这事我一直忍着，理由是「反正也没出过事」，而且大多数密码都是自己常记的密码，都在脑子里了。

真正让我下决心动手的，是最近刷到了 Vaultwarden 这个开源项目。它是密码管理器 Bitwarden 的自托管服务端，可以把「存密码的那朵云」搬回自己机器上。看到它的第一反应是「这不就是我一直缺的东西吗」，密码最怕丢、最怕乱，而它正好管这两件事。没什么好犹豫的，动手部署一套。

这篇是一份可以照抄的完整手册，从一台服务器开始，到全设备用上自己的密码库，包括：

- **准备清单**：需要哪些东西，逐项核对，新手卡点提前标出
- **部署主线**：Docker Compose 加 Caddy 自动 HTTPS，六步走完
- **注册与收尾**：注册账号、关闭注册、开启两步验证，一步不省
- **客户端接入**：浏览器扩展、手机 App、桌面端全部连回自建服务
- **备份与维护**：每日自动备份、怎么恢复、以后怎么升级
- **避坑提示**：2026 年部署会撞上的几个新情况，提前绕开

跟着做，分分钟把这件事办完。

## Vaultwarden 是什么，为什么选它

一句话：**Bitwarden 协议的开源自托管服务端**。

先澄清一个容易搞混的点。装在手机上、浏览器里的客户端，全是 Bitwarden 官方的，Vaultwarden 替换的只是服务端那半边。官方服务端要跑 .NET 加数据库，对一台小服务器来说太重；Vaultwarden 用 Rust 写成单个二进制，默认配 SQLite，空载内存 50 到 150MB，1 核 1G 的最低配 VPS 就能跑。你的密码存在自己服务器上，加密照样是端到端的，服务器磁盘上只有密文。

那和 1Password 这类商业服务差在哪？差在服务端和它的商业模式上。商业服务是闭源的、按年付费、只能在它的服务器上用；Vaultwarden 是开源的、你自建、数据不出自己的机器，功能上该有的都有——密码生成器、附件、两步验证、浏览器扩展和手机 App 同步，一个不少。客户端体验基本一致，区别就是服务端归谁管。

版本选择没什么可犹豫的。写作时最新版是 1.37.4（2026 年 10 月发布），这个版本一口气修了 7 个安全公告，其中 1 个 High 级。本手册所有命令都把版本号钉死在 1.37.4，你照做时如果有更新的稳定版，换成那个版本号即可，原则只有一条：**写具体版本号，别用 latest**。latest 今天是 1.37.4，明天是什么，没人担保。

顺带把「免费」这两个字说清楚，免得误会：免费的是软件本身。Vaultwarden 是 AGPL-3.0 开源项目，不收授权费、不限账号数、不看你几个人用，功能也不阉割。真要花钱的地方只有一台跑它的机器——你本来就有服务器的话，这笔账基本是零。

## 部署前准备清单

| # | 需要什么 | 说明 |
|---|---|---|
| 1 | 一台 Linux 服务器 | Ubuntu 22.04 / Debian 12 等主流发行版，最低 1 核 1G 内存 20G 盘，能 SSH 登录 |
| 2 | 公网 IP 与放行端口 | 云厂商安全组或防火墙放行 22、80、443 三个端口，这是新手最常见的卡点 |
| 3 | 一个域名 | 强烈建议，原因见下方提示块；你需要有它的 DNS 解析管理权 |
| 4 | 一条 DNS 记录 | 加一条子域 A 记录指向服务器 IP，第二步做 |
| 5 | Docker 与 Compose v2 | 没有没关系，第一步装 |
| 6 | 发件邮箱（可选） | 只有用邮箱验证码两步验证、邀请成员、邮件提醒时才需要，不配不影响主线 |

> **重要提示：为什么必须域名加 HTTPS**
> Bitwarden 客户端从 v2025.11.0 起强制所有连接走 HTTPS，连 `http://localhost` 都不再豁免。用 HTTP 部署的实例，网页能打开，登录注册时必报 `Insecure URL not allowed. All URLs must use HTTPS.`。所以证书不是可选项。本手册用 Caddy 自动向 Let's Encrypt 申请，而这需要域名做验证。

路线说明：主线是 Docker Compose 加 Caddy，适合从零开始的服务器；如果你的机器上已经有 Nginx 在跑，直接跳到「路线 B」一节看差异步骤，我自己的服务器就是这种情况。

至于「纯内网玩玩、不买域名」的想法，这里直接劝退：客户端强制 HTTPS 之后，没有域名和有效证书就走不通，别在这上面浪费时间。

## 第一步：安装 Docker

已装过的可以跳过，用 `docker --version` 验证即可。

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER    # 让当前用户免 sudo 用 docker，重新登录生效
```

验证：

```bash
docker --version          # 28.x 或更新
docker compose version    # v2.x，注意是 compose 子命令，不是老的 docker-compose
```
![ezimage-1792851034423](https://images.flashnote.top/2026/10/1792851034586-cb1emlkg.png)


## 第二步：配置 DNS 解析

到你的域名服务商（Cloudflare、阿里云、GoDaddy 都行）加一条 A 记录：主机名填 `vault`，值填服务器公网 IP。Cloudflare 用户先把记录设为灰云（DNS only），跑通之后再考虑要不要开代理。

在你自己的电脑上验证解析是否生效：

```bash
dig +short vault.example.com @1.1.1.1     # 应返回你的服务器 IP
```

![ezimage-1792851153191](https://images.flashnote.top/2026/10/1792851153351-dwmntxd8.png)


## 第三步：部署 Vaultwarden 和 Caddy

主线方案是两个容器：vaultwarden 跑服务本体，caddy 负责 HTTPS 证书的自动申请和续期，全程不用手动碰证书。

**建目录。** 位置随你，`/opt`、`/data` 都行，原则是整个项目收在一棵目录树里，以后备份迁移只看这一个地方。本手册统一用 `/opt/vaultwarden`：

```bash
sudo mkdir -p /opt/vaultwarden && sudo chown $USER: /opt/vaultwarden
cd /opt/vaultwarden
mkdir -p vw-data caddy-data caddy-config logs
```

**生成管理面板令牌。** Vaultwarden 自带一个 `/admin` 管理面板，密码要用 argon2 哈希生成：

```bash
docker run --rm -it vaultwarden/server:1.37.4 /vaultwarden hash
```

命令会提示输入两次密码。注意这是管理面板的登录密码，不是 Bitwarden 主密码，明文自己另存好。输出是一整行 `ADMIN_TOKEN='$argon2id$...'`，原样复制。

**写 `.env` 文件。** 这串哈希里有 5 个 `$` 符号，放进 `.env` 走变量引用，完全不用转义；要是直接写进 compose 的 environment 段，每个 `$` 都得改成 `$$`，错一个就起不来。两条路别混，本手册走 `.env`：

```bash
cat > .env <<'EOF'
DOMAIN=https://vault.example.com
# 新装先 true，注册完自己的账号后改 false（第五步）
SIGNUPS_ALLOWED=true
# 个人使用的话，注册完也一起改成 false，网页端的「创建账户」按钮才会消失（第五步有解释）
INVITATIONS_ALLOWED=true
# 上面 hash 命令输出的整行，保留单引号、保持单个 $
VAULTWARDEN_ADMIN_TOKEN='$argon2id$v=19$m=65540,t=3,p=4$....'
EOF
chmod 600 .env
```

**写 `docker-compose.yml`：**

```bash
cat > docker-compose.yml <<'EOF'
services:
  vaultwarden:
    image: vaultwarden/server:1.37.4        # 固定版本号，别用 latest
    container_name: vaultwarden
    restart: unless-stopped
    environment:
      DOMAIN: ${DOMAIN}
      SIGNUPS_ALLOWED: ${SIGNUPS_ALLOWED}
      INVITATIONS_ALLOWED: ${INVITATIONS_ALLOWED}
      ADMIN_TOKEN: ${VAULTWARDEN_ADMIN_TOKEN}
      IP_HEADER: "X-Real-IP"                # 反代传真实 IP 头，限速和日志才准
    volumes:
      - ./vw-data:/data
    networks:
      - proxy
    # 注意这里不发布任何端口，80/443 全由 Caddy 接管

  caddy:
    image: caddy:2
    container_name: caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp"                       # HTTP/3，可选
    environment:
      ACME_EMAIL: ${ACME_EMAIL:-}           # 可选：Let's Encrypt 通知邮箱
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - ./caddy-data:/data                  # 证书与 ACME 账号，必须持久化
      - ./caddy-config:/config
    networks:
      - proxy

networks:
  proxy:
EOF
```

**写 `Caddyfile`：**

```bash
cat > Caddyfile <<'EOF'
vault.example.com {
    encode gzip

    # 与 Vaultwarden 上传上限对齐（附件和 Send 最大 525MB）
    request_body {
        max_size 525MB
    }

    reverse_proxy vaultwarden:80 {
        header_up X-Real-IP {remote_host}
    }
}
EOF
```

**启动：**

```bash
docker compose config      # 先核对：不应出现 variable is not set 警告
docker compose up -d
docker ps --filter name=vaultwarden # 应 Up
docker logs --tail 20 caddy        # 应看到证书申请成功
docker logs --tail 20 vaultwarden  # 应看到 Rocket has launched，无 ERROR
```
![ezimage-1792852779105](https://images.flashnote.top/2026/10/1792852779627-6elebuiu.png)

> **如果证书没签下来**：按顺序查三件事，安全组是否放行了 80 和 443（Let's Encrypt 要连 80 验证）、`dig` 确认域名已解析到本机、Caddy 日志里的具体报错。证书颁发机构有限速，反复失败就等一小时再试。

## 第四步：上线验证

| 检查项 | 方法 | 预期 |
|---|---|---|
| DNS 解析 | `dig +short vault.example.com` | 返回服务器 IP |
| 服务探活 | `curl -s -o /dev/null -w '%{http_code}' https://vault.example.com/alive` | 200 |
| HTTP 跳转 | 浏览器开 `http://vault.example.com` | 自动跳到 https |
| 证书 | 看浏览器地址栏 | 证书有效，域名匹配 |
| 网页密码库 | 打开 `https://vault.example.com` | 出现 Bitwarden 登录注册页 |

五项全过再往下走。

![ezimage-1792851711603](https://images.flashnote.top/2026/10/1792851712252-uvig1an3.png)


## 第五步：注册账号，然后立刻做两件事

**注册。** 浏览器打开 `https://vault.example.com`，点创建账户，填邮箱和主密码。主密码是整个密码库的加密钥匙，端到端加密意味着服务器上只有密文，**主密码忘了没有任何找回手段**，包括对你自己。设一个记得住的强密码，拿纸抄一份放进抽屉。


**第一件事：关闭注册，并且把「创建账户」按钮一起藏掉。** 个人使用的话，注册完自己的账号就要马上关掉入口。改 `.env`：

```bash
SIGNUPS_ALLOWED=false        # 关闭公开注册
INVITATIONS_ALLOWED=false    # 关闭邀请注册；也是隐藏网页端「创建账户」按钮的前提
```

然后重建并确认生效：

```bash
docker compose up -d
docker exec vaultwarden printenv SIGNUPS_ALLOWED        # 预期 false
docker exec vaultwarden printenv INVITATIONS_ALLOWED    # 预期 false
```

公网上开着注册的实例等于给扫描器开门，`/admin` 面板被扫的频率比你想象的高。

这里有个坑，我第一次部署就撞上了：**只把 `SIGNUPS_ALLOWED` 改成 false，网页登录页的「创建账户」链接还照样在。** 服务端确实已经拒绝注册了，但按钮就是不走。

原因在服务端怎么算这个按钮。网页端看的是 `/api/config` 返回的 `settings.disableUserRegistration`，服务端算它的逻辑里有这么一段（1.37.4 源码，简化后）：

```rust
pub fn is_signup_disabled(&self) -> bool {
    (!self.signups_allowed()
        && self.signups_domains_whitelist().is_empty()
        && (self.mail_enabled() || !self.invitations_allowed()))
        || (self.sso_enabled() && self.sso_only())
}
```

关键在括号里那半段 `mail_enabled() || !invitations_allowed()`：

- 没配 SMTP 的话，`mail_enabled()` 是 false
- `INVITATIONS_ALLOWED` 默认是 true，所以 `!invitations_allowed()` 也是 false
- 两个 false 凑一起，整个条件不成立，`disableUserRegistration` 还是 false，按钮照旧显示

所以**光关 `SIGNUPS_ALLOWED` 是关不掉这个按钮的**，得让那个括号成立。两个办法任选一个：

| 做法 | 效果 | 副作用 |
|---|---|---|
| `INVITATIONS_ALLOWED=false`（个人使用推荐） | 按钮消失，邀请通道一并关闭 | 以后不能用管理面板「邀请」新用户，单用户实例没有影响 |
| 配 SMTP（`SMTP_HOST` + `SMTP_FROM`） | 按钮消失，邀请功能保留 | 需要真实发信凭据，顺带解锁邮箱两步验证、密码提示邮件 |

上游这么设计是有原因的：没配 SMTP 的时候系统发不出邀请邮件，被邀请的人只能自己找上门注册，所以刻意留了这个入口。代价就是「注册已关」和「按钮已隐藏」成了两件事，个人用直接把邀请通道也关了最省事。

验证按钮有没有真藏好，不用肉眼找，查接口就行：

```bash
curl -s https://vault.example.com/api/config \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['settings']['disableUserRegistration'])"
# 预期 True（True 表示按钮已隐藏）
```

顺手确认服务端确实拦得住注册，比按钮隐藏更有意义：

```bash
curl -s -X POST https://vault.example.com/identity/accounts/register/send-verification-email \
  -H "Content-Type: application/json" -d '{"email":"probe@example.com","name":"probe"}'
# 预期 400 {"message":"Registration not allowed or user already exists"}
```

> 1.37.4 的注册端点有两级，别用旧路径测：先 `POST /identity/accounts/register/send-verification-email`（第一步，发验证邮件），再 `POST /identity/accounts/register/finish`（第二步，真正建号）。旧的 `/identity/accounts/register` 已经 404 了。

改完刷新登录页，「创建账户」链接就该消失了，只剩登录入口。

![ezimage-1792855528688](https://images.flashnote.top/2026/10/1792855529297-uwbf8e9c.png)

**第二件事：开启两步验证。** 网页右上角头像进设置，打开「安全」里的「两步登录」：

- **验证器 App（TOTP）**：用 Google Authenticator、Microsoft Authenticator 或 Aegis 扫二维码，回填 6 位验证码开启。开完**立刻保存恢复码**，抄到纸上放到密码库之外，验证器丢了它就是唯一的进门方式
- **Passkey**：Mac 上就是 Touch ID，Windows 上是 Hello。保存位置选 iCloud 钥匙串或 Chrome 同步，别选「仅本设备」，否则换设备就把自己锁在外面了
- 两种可以并存：日常 Passkey 顺手，TOTP 做跨设备兜底，恢复码做最后兜底

![ezimage-1792852119702](https://images.flashnote.top/2026/10/1792852120130-kwvnpu0g.png)


管理面板在 `https://vault.example.com/admin`，密码就是第三步生成的那个。有个行为提前说：**面板里保存过配置之后，会生成 `vw-data/config.json`，它的优先级高于 `.env` 环境变量**，之后你改 `.env` 会「看起来不生效」。要么一直在面板里改，要么一直用 `.env`，别两头改。

## 第六步：客户端接入

浏览器扩展、手机 App、桌面端全用 Bitwarden 官方的，每个客户端改一处：连到自建服务器。

先说我踩的坑。我凭印象去已登录的设置页里找「Server URL」输入框，翻了半天没有。**新版客户端里，这个入口只在登录和注册界面上**，已登录状态根本看不到。所以顺序必须是：先退出登录，回到登录界面改 URL，再输主密码。反过来操作的话，你登录的还是官方云，还会误以为「自建坏了」。

**浏览器扩展（Chrome / Edge / Firefox）：**

1. 点扩展图标，如果已经登录过 bitwarden.com，先退出登录
2. 登录界面找到「Logging in on」下拉，默认是 bitwarden.com，改成 **Self-hosted**
3. Server URL 填 `https://vault.example.com`，保存，其余 API、Identity 栏留空自动继承
4. 邮箱加主密码登录，通过两步验证

![ezimage-1792852234738](https://images.flashnote.top/2026/10/1792852235032-rd5yeiq7.png)

**手机 App（iOS / Android）：** 登录界面同样找「Logging in on」下拉，选 Self-hosted 填 URL，登录后在设置里打开 Face ID 或指纹解锁。

**桌面端：** 登录界面是「Accessing」下拉，其余相同。

**命令行（可选）：** `bw logout && bw config server https://vault.example.com`

全部接完做个小测试：浏览器扩展里存一条新密码，打开手机 App 手动同步，能刷出来就说明整条链路通了。


## 第七步：每日备份与恢复

密码库这种服务，备份不是可选项。Vaultwarden 自带在线备份命令，用的是 SQLite 的 VACUUM INTO，**不需要停服务**。

在服务器上建备份脚本：

```bash
sudo tee /opt/vaultwarden/vw-backup.sh >/dev/null <<'EOF'
#!/bin/bash
set -euo pipefail
BASE=/opt/vaultwarden
STAMP=$(date +%Y%m%d-%H%M%S)
mkdir -p "$BASE/backups"

docker exec vaultwarden /vaultwarden backup

NEWEST=$(ls -1t "$BASE/vw-data"/db_*.sqlite3 | head -1)
tar -czf "$BASE/backups/vw-$STAMP.tar.gz" -C "$BASE/vw-data" \
    "$(basename "$NEWEST")" attachments sends config.json rsa_key.pem 2>/dev/null || true

ls -1t "$BASE/vw-data"/db_*.sqlite3 | tail -n +4 | xargs -r rm -f
find "$BASE/backups" -name 'vw-*.tar.gz' -mtime +14 -delete
EOF
sudo chmod 750 /opt/vaultwarden/vw-backup.sh
```

脚本逻辑说人话：让容器自己导出一份一致的数据库快照，把快照连同附件、配置、密钥打成压缩包；数据库快照留最近 3 份，压缩包留 14 天，更旧的自动清掉。

挂上 cron，每天凌晨 4:40 跑：

```bash
(crontab -l 2>/dev/null; echo "40 4 * * * /opt/vaultwarden/vw-backup.sh >> /opt/vaultwarden/logs/backup.log 2>&1") | crontab -
```

手动跑一次验证：

```bash
/opt/vaultwarden/vw-backup.sh && echo OK
tar -tzf /opt/vaultwarden/backups/vw-*.tar.gz    # 应看到 db_*.sqlite3 和 rsa_key.pem
```

备份防的是误删，防不了磁盘损坏，备份文件和原数据在同一块盘上，盘坏了就一起没。有条件用 rclone 或 restic（自带加密）把 `backups/` 目录再推一份到对象存储或另一台机器。

**恢复方法**（希望你别用到，但先存着）：

```bash
cd /opt/vaultwarden
docker compose stop vaultwarden
tar -xzf backups/vw-<时间戳>.tar.gz -C vw-data
rm -f vw-data/db.sqlite3-wal        # 必须删掉旧的 WAL 文件，否则可能损坏
mv vw-data/db_<快照时间戳>.sqlite3 vw-data/db.sqlite3
docker compose start vaultwarden
```

## 以后怎么升级

1. 先手动跑一次备份脚本，数据库迁移是单向的，回滚全靠这份备份
2. 去官方 Release 页读新版的 Upgrade notes
3. 改 `docker-compose.yml` 里的镜像版本号
4. `docker compose up -d` 拉新镜像重建
5. 验证探活 200、客户端登录同步正常

出问题就回滚：版本号改回去再 up；如果新版本已经跑过数据库迁移，用第 1 步的备份恢复数据库。

## 路线 B：服务器上已经有 Nginx

我的服务器就属于这种情况，上面已经跑着一套 Nginx 和几个站点，没必要再起一个 Caddy 抢端口。和主线比，有两处不同。

**容器配置不同。** compose 里去掉整个 caddy 服务，vaultwarden 的端口改成只绑回环：

```yaml
    ports:
      - "127.0.0.1:8222:80"     # 只监听本机回环，公网摸不到
```

**证书和反代交给已有 Nginx。** 最直接的方案是用 certbot 签发：

```bash
sudo certbot --nginx -d vault.example.com
```

我自己用的是另一种方式：域名 DNS 托管在 Cloudflare，用开源的 **allinssl** 面板申请证书——在里面配一个 Cloudflare API Token（权限只给对应域名的 DNS 编辑），走 DNS-01 验证签了一张**通配符证书**，allinssl 会自动续期并部署到 Nginx 的证书目录。这么选有三个理由：一张证书覆盖所有子域，以后加别的服务不用重新签；DNS-01 验证不需要开放额外的端口；续期全自动，不用惦记到期的事。前提是你的域名 DNS 托管在 Cloudflare（allinssl 也支持其他主流 DNS 服务商），API Token 只贴进面板，不要出现在命令行和聊天记录里。走这条路的证书文件路径和下面 server 块里写的 letsencrypt 路径不同，按你的实际部署路径填。

再给 Nginx 加一个 server 块（以 certbot 签发的路径为例）：

```nginx
server {
    listen 443 ssl;
    server_name vault.example.com;
    ssl_certificate     /etc/letsencrypt/live/vault.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vault.example.com/privkey.pem;
    client_max_body_size 525M;    # 与 Vaultwarden 附件上限对齐
    location / {
        proxy_pass http://127.0.0.1:8222;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade           $http_upgrade;
        proxy_set_header Connection        "upgrade";
    }
}
```

Upgrade 这两行别省。新版 Vaultwarden 的 WebSocket 实时同步走主端口，少了这两行，症状很隐蔽：登录正常，手机和网页之间就是不同步。

改完先 `nginx -t` 测试，通过再 `nginx -s reload` 热加载，别用 restart，同机的其他站点会断连。

我自己部署时在这条路线上多撞了两个坑，都和「服务器上已经有别的服务」有关，写出来给你避雷。

**容器里的 127.0.0.1 不是你。** 如果你的 Nginx 也跑在容器里（我的就是），`proxy_pass` 写 `127.0.0.1:8222` 会一直 502，因为容器里的回环地址指的是它自己，不是宿主机。解法是把 vaultwarden 和 nginx 放进同一个 docker 网络，上游直接写容器名：`proxy_pass http://vaultwarden:80;`。

**自动签发工具会静默覆盖同名证书。** 上面提到的 allinssl 自动部署，就是我踩坑的地方：它的部署文件名默认是 `cert.pem` 和 `key.pem`，正好和证书目录里一份旧证书同名，直接被覆盖，旧私钥没有备份，找不回来。用任何自动签发工具之前，先看一眼证书要落到哪个目录、里面有什么，同名文件提前挪走或改部署文件名。

## 安全加固清单

上线只是起点，这几条逐项过一遍：

- **版本保持更新**：订阅 GitHub Release，安全公告出了尽快升，升级前先备份
- **注册开关**：`SIGNUPS_ALLOWED=false` 必须落地，个人使用再把 `INVITATIONS_ALLOWED` 也关掉，网页端的「创建账户」按钮才会消失，别信「我的域名没人知道」
- **两步验证**：主账号必开，有家人朋友共用就人人都开
- **`.env` 权限**：设 600，管理令牌虽然是哈希，但明文密码只该在你自己手里
- **防火墙**：只开 22、80、443，云安全组同理
- **密码提示**：`SHOW_PASSWORD_HINT` 保持默认 false，公开实例绝不能开
- **备份**：每日任务跑起来，并且至少完整演练一次恢复，没演练过的备份等于没有
- **SSH**：改密钥登录、禁密码登录，这是服务器基本功，不属于本项目但必须做

## 常见问题

| 症状 | 原因 | 处理 |
|---|---|---|
| 登录报 Insecure URL not allowed | 用了 http 访问，客户端全局强制 HTTPS | 一律用 https:// 开头的地址 |
| 浏览器打不开或超时 | 安全组没放行 80/443、DNS 没生效、容器没起 | 依次查 dig、云安全组、docker compose ps 和日志 |
| 证书一直签不下来 | 端口不通、域名刚解析还没传播、证书机构限速 | 放行端口等生效，隔一小时再试 |
| 手机 App 连不上 | URL 填了 http 或用了自签证书 | 填 https 加有效证书 |
| 登录报用户不存在 | 客户端连的还是 bitwarden.com | 登录界面 Logging in on 选 Self-hosted |
| 关了注册，网页上「创建账户」还在 | 按钮由 /api/config 的 disableUserRegistration 控制，只设 SIGNUPS_ALLOWED=false 关不掉 | 补 INVITATIONS_ALLOWED=false，或配置 SMTP，查接口确认返回 true |
| 两步验证码总是错 | 服务器或手机时间不同步 | 服务器开 NTP，手机设自动对时 |
| 忘了管理面板密码 | 面板密码可以重置 | 重新跑 hash 命令生成新的，更新 .env 后重建 |
| 忘了主密码 | 端到端加密，无人能找回 | 用恢复码；恢复码也没有就只能删库重来 |
| 改了 .env 不生效 | 面板保存过配置，config.json 优先级更高 | 统一在面板改，或删掉 config.json 重走 env |

## 自己掌控，代价是什么

先把话说在前面：免费的是软件，不是这件事本身。自建不代表白拿，代价得说清楚：备份、续签、升级全是自己的事；主密码忘了没有任何客服能帮你；单机部署没有官方那种多机房冗余，服务器挂了密码库就跟着挂，所以备份不是可选项。

换来的东西也实在：数据在自己机器上，想开几个账号开几个，功能没有阉割，密码库什么时候看都是自己的。

密码这份数据，我宁可自己操心，也不想再放在最随便的地方。如果你也有一堆散落在本子和备忘录里的密码，这个下午值得花。
