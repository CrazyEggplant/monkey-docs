# Docker 笔记（一）

### 1. Docker 安装

#### 1.1 使用命令安装(以ubuntu为例)

- 卸载旧版本

```
sudo apt-get remove docker docker-engine docker.io
```

- 添加使用 HTTPS 传输的软件包以及 CA 证书

```
sudo apt update
sudo apt-get install apt-transport-https ca-certificates curl gnupg lsb-release
```

- 添加软件源的 `GPG` 密钥

```
curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

- 向 `sources.list` 中添加 Docker 软件源

```
echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://mirrors.aliyun.com/docker-ce/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

- 安装Docker

```
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

#### 1.2 使用脚本安装（建议使用）

Docker 官方为了简化安装流程，提供了一套便捷的安装脚本，Ubuntu 系统上可以使用这套脚本安装，另外可以通过 `--mirror` 选项使用国内源进行安装：

```
curl -fsSL get.docker.com -o get-docker.sh
sudo sh get-docker.sh --mirror Aliyun
```

**注：此方法会将`/etc/apt/sources.list.d/docker.list`中的软件源设置为阿里源**

#### 1.3 启动Docker

```
sudo systemctl enable docker
sudo systemctl start docker
```

#### 1.4 将当前用户加入Docker组

```
sudo groupadd docker
sudo usermod -aG docker $USER
```

#### 1.5 验证Docker是否正确安装

重新打开终端，并输入如下命令：

```
docker run --rm hello-world
```

若能正常输出信息，则说明安装成功。

### 2. Docker镜像源配置

- 在 `/etc/docker/daemon.json` 中写入如下内容（如果文件不存在请新建该文件）：

```json
{
  "registry-mirrors": [
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
```

- 重启服务

```
sudo systemctl daemon-reload
sudo systemctl restart docker
```

### 3. Docker镜像、容器关系

镜像（`Image`）和容器（`Container`）的关系，就像是面向对象程序设计中的 `类` 和 `实例` 一样，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。

### 4. Docker镜像常用操作

#### 4.1 拉取镜像

从Docker镜像仓库获取镜像的命令是 `docker pull`。其命令格式为：

```
docker pull 软件名[:标签]
```

例如：

```
docker pull ubuntu:18.04
```

若软件名后方无标签，则默认拉取latest版本

#### 4.2 运行镜像

- 运行镜像后，会创建容器，并运行。

​		以 `ubuntu:18.04` 为例，如果我们打算启动里面的 `bash` 并且进行交互式操作的话，可以执行如下命令：

```
docker run -it --rm --name=test_ubuntu ubuntu:18.04 bash
```

参数解析：

- `-it`：这是两个参数，一个是 `-i`：交互式操作，一个是 `-t` 终端。我们这里打算进入 `bash` 执行一些命令并查看返回结果，因此我们需要交互式终端
- `--rm`：容器退出后立即删除该容器
- `--name`：自定义容器名称
- `ubuntu:18.04`：用 `ubuntu:18.04` 镜像为基础来启动容器
- `bash`：指定交互式 Shell使用 `bash`。

#### 4.3 列出系统内的镜像

- 想列出所有已经下载下来的镜像，可以使用如下命令:

```
docker images
或
docker image ls
```

- 列出部分镜像（以ubuntu为例），列出所有ubuntu镜像：

```
docker image ls ubuntu
```

- 列出特定的某个镜像（以ubuntu为例），指定软件名和标签：

```
docker image ls ubuntu:18.04
```

#### 4.4 删除本地镜像

- 删除本地的镜像，可以使用 `docker image rm` 命令，其格式为：

```
docker image rm [选项] <镜像1> [<镜像2> ...]
```

其中，`<镜像>` 可以是 `镜像短 ID`、`镜像长 ID`、`镜像名` 或者 `镜像摘要`

#### 4.5 导出镜像到文件

- 使用 `docker save` 命令可以将镜像保存为归档文件。

​		若使用 `gzip` 压缩：

```
docker save ubuntu:18.04 | gzip > ubuntu1804.tar.gz
```

#### 4.6 导入镜像

- 将导出的镜像文件复制到另外的机器上，使用如下命令导入镜像：

```
docker load -i ubuntu1804.tar.gz
```

### 5. Docker容器常用操作

#### 5.1 启动容器

- 同本文`<4.2 运行镜像>`

#### 5.2 后台运行

- 启动容器时，输入`-d`参数，容器会在后台运行，并不会把输出的结果 (STDOUT) 打印到宿主机上面（输出结果可以用 `docker logs` 查看）。

```
docker run -d ubuntu:18.04 /bin/bash -c "echo hello wrold"
```

#### 5.3 终止容器

- 容器外部：使用 `docker container stop 容器ID` 来终止一个运行中的容器
- 容器内部：在容器的终端内，输入 `exit` 命令或 `Ctrl+d` ，所创建的容器立刻终止

#### 5.4 进入容器

- 进入容器进行操作，使用  `docker exec` 命令：

```
docker exec -it 容器ID bash
```

**注：使用`docker exec`命令进入容器内，在终端输入`exit`，退出容器时，不会导致容器停止**

#### 5.5 查看运行中的容器

- 查看运行中容器可使用如下命令：

```
docker ps
或
docker container ls
```

#### 5.6 查看已经终止的容器

- 查看已经终止容器可使用如下命令：

```
docker ps -a
或
docker container ls -a
```

#### 5.7 删除容器

- 使用 `docker container rm` 来删除一个处于终止状态的容器：

```
docker container rm 容器名
```

**注：如果要删除一个运行中的容器，可以添加 `-f` 参数**

#### 5.8 清除所有终止状态的容器

- 使用 `docker container ls -a` 命令可以查看所有已经创建的包括终止状态的容器，用下面命令清除：

```
docker container prune
```

### 6. Dockerfile定制镜像

#### 6.1 FROM

- `FROM`指定基础镜像，若本地没有镜像，则会从Docker Hub下载

```dockerfile
FROM ubuntu:16.04
...
```

#### 6.2 WORKDIR

- `WORKDIR`指定工作目录，**如果目录不存在，则会创建目录**

```dockerfile
FROM ubuntu:16.04
WROKDIR /home
...
```

#### 6.3 COPY

- `COPY`将文或目录拷贝到镜像文件中

```dockerfile
FROM ubuntu:16.04
WROKDIR /home
COPY . /home
...
```

#### 6.4 ADD

- `ADD`命令也具备拷贝文件的功能，但与`COPY`相比，它还具备如下功能：

1. 当拷贝的是压缩文件时，`ADD`命令会**自动解压文件**
2. 拷贝的源文件路径可以为外部链接

```dockerfile
FROM ubuntu:16.04
WROKDIR /home
ADD xxx.tar.gz /home
...
```

#### 6.5 RUN

- `RUN`用来执行命令行命令，共有`shell`和`exec`两种命令格式，此处推荐`shell`格式

```dockerfile
FROM ubuntu:16.04
RUN apt update \
		&& apt install -y $softName \
...
```

#### 6.6 CMD

- `CMD` 用于指定默认的容器主进程的启动命令（容器启动时运行的命令），`CMD`运行的命令结束，容器生命周期也就结束了
- `CMD`也有`shel`l和`exec`两种命令格式

```
FROM ubuntu:16.04
CMD ["cat", "/etc/os-release"]
```

