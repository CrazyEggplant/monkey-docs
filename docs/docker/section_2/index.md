# Docker入门教程（二）

## 1. 容器间通讯

### 1.1 新建网络

- 创建一个新的 Docker 网络

```bash
docker network create -d bridge my-net
```

参数解析：

- `-d` ：指定 Docker 网络类型，有 `bridge` 、`overlay`。其中 `overlay` 网络类型用于`Docker Swarm（Docker 集群管理工具）`。

### 1.2 连接容器

- 运行一个容器并连接到新建的 `my-net` 网络

```bash
docker run -it --rm --name busybox1 --network my-net busybox sh
```

- 打开新的终端，再运行一个容器并加入到 `my-net` 网络

```bash
docker run -it --rm --name busybox2 --network my-net busybox sh
```

- 在 `busybox1` 容器输入以下命令

```bash
/ # ping busybox2
PING busybox2 (172.18.0.3): 56 data bytes
64 bytes from 172.18.0.3: seq=0 ttl=64 time=0.112 ms
64 bytes from 172.18.0.3: seq=1 ttl=64 time=0.141 ms
```

- 在 `busybox2` 容器输入以下命令

```bash
/ # ping busybox1
PING busybox1 (172.18.0.2): 56 data bytes
64 bytes from 172.18.0.2: seq=0 ttl=64 time=0.196 ms
64 bytes from 172.18.0.2: seq=1 ttl=64 time=0.107 ms
```

这样，`busybox1` 容器和 `busybox2` 容器建立了互联关系。

## 2. Docker Compose

Dcoker Compose使用 YML 配置文件可以启动多个服务（容器），所有服务在隔离环境中一起运行，无需配置容器的Docker网络。

### 2.1 Docker Compose版本选择

Docker Compose 项目最早由 Python 编写，目前 Docker 官方用 GO 语言重写了 Docker Compose，所以 Docker Compose 1.x 版本与2.x 版本有细微差异：

**注：仅命令头部差异，选项参数等一致**

- 1.x 版本

```bash
docker-compose version

docker-compose version 1.29.2, build unknown
docker-py version: 5.0.3
CPython version: 3.8.10
OpenSSL version: OpenSSL 1.1.1f  31 Mar 2020
```

- 2.x 版本

```bash
docker compose version

Docker Compose version v2.6.0
```

### 2.2 安装Docker Compose

- 1.x 版本使用`pip`安装

```bash
sudo pip install -U docker-compose
```

- 2.x 版本使用`apt`命令安装

```bash
sudo apt-get update
sudo apt-get install docker-compose-plugin
```

### 2.3 Docker Compose常用命令

#### 2.3.1 version

查看Docker Compose的版本信息，同`2.1`章节

#### 2.3.2 up

启动`docker-compose.yml`中配置的所有服务，自动拉取Docker镜像、构建镜像、启动服务容器，并关联服务相关容器的一系列操作。

```bash
docker-compose up
```

**参数选项：**		

- `-d`：后台运行
- `--t, --timeout TIMEOUT`：停止容器时候的超时（默认为 10 秒）
- `--no-build`：不自动构建缺失的服务镜像
- `--force-recreate`：强制重新创建容器，不能与 `--no-recreate` 同时使用
- `--no-recreate`：如果容器已经存在了，则不重新创建，不能与 `--force-recreate` 同时使用

**注意：** 一般使用时仅输入`-d`参数即可，其他参数默认

#### 2.3.3 down

此命令将会停止 `up` 命令所启动的容器，并移除网络

```bash
docker-compose down
```

#### 2.3.4 images

列出 Compose 文件中包含的镜像

```bash
docker-compose images
```

**注：仅会列出当前项目文件中的镜像**

#### 2.3.5 rm

删除所有（停止状态的）服务容器。推荐先执行 `docker-compose stop` 命令来停止容器

```bash
docker-compose rm
```

**参数选项：**

- `-f, --force`：强制直接删除，包括非停止状态的容器。一般尽量不要使用该选项
- `-v`：删除容器所挂载的数据卷

#### 2.3.6 exec

进入指定的容器

```bash
docker-compose exec
```

**注：** 命令基本和`docker exec`一致

#### 2.3.7 ps

列出项目中目前运行的所有容器

```bash
docker-compose ps
```

#### 2.3.8 stop

停止已经处于运行状态的容器，但不删除

```bash
docker-compose stop
```

**参数选项：**

- `-t, --timeout TIMEOUT`：停止容器的超时时间（默认为10秒）

#### 2.3.9 restart

重启项目中的服务

```bash
docker-compose restart
```

**参数选项：**

- `-t, --timeout TIMEOUT`： 指定重启前停止容器的超时（默认为 10 秒）

### 2.4 模板文件（YML）常用参数说明

#### 2.4.1 version

指定本 yml 依从的`Compose`哪个版本制定的

```yaml
version: "3"
```

#### 2.4.2 services

services子级表示需启动的服务

```yml
version: "3"
services:
  web:
	
  redis:
```

#### 2.4.3 image

指定使用的`docker`镜像名和版本

```yml
version: "3"
services:
  web:
    image: python:3.6-alpine
	
  redis:
    image: redis:alpine
```

#### 2.4.4 build

指定 `Dockerfile` 所在文件夹的路径（可以是绝对路径，或者相对 docker-compose.yml 文件的路径）。 `Compose` 将会利用它自动构建这个镜像，然后使用这个镜像。

```yml
version: "3"
services:
  web:
    build: .
	
  redis:
    image: redis:alpine
```

#### 2.4.5 ports

暴露端口信息。
使用宿主端口：容器端口 `(HOST:CONTAINER)` 格式，或者仅仅指定容器的端口（宿主将会随机选择端口）都可以

```yml
version: "3"
services:
  web:
    build: .
    ports:
      - "5000:5000"
	
  redis:
    image: redis:alpine
```

#### 2.4.6 command

容器启动时，执行的命令。**会覆盖容器启动后默认执行的命令（Dockerfile中的CMD参数）**

```yml
version: "3"
services:
  web:
    build: .
    ports:
      - "5000:5000"
    command: python app.py
	
  redis:
    image: redis:alpine
```

#### 2.4.7 environment

设置环境变量。你可以使用数组或字典两种格式。
只给定名称的变量会自动获取运行 Compose 主机上对应变量的值，可以用来防止泄露不必要的数据。

```yml
version: "3"
services:
  web:
    build: .
    ports:
      - "5000:5000"
    command: python app.py
	
  redis:
    image: redis:alpine
    
  db:
    image: postgres
    environment:
      POSTGRES_PASSWORD: 'postgres'
```

#### 2.4.8 volumes

数据卷所挂载路径设置。

**注：可以把某一镜像中打包好的内容同步到本地**

```yml
version: "3"
services:
  web:
    build: .
    ports:
      - "5000:5000"
    command: python app.py
    volumes:
      - .:/code	 # 此web镜像会根据项目中的Dockerfile构建镜像，构建结束后会把 /code 目录下的内容拷贝到当前目录
	
  redis:
    image: redis:alpine
    
  db:
    image: postgres
    environment:
      POSTGRES_PASSWORD: 'postgres'
```

#### 2.4.9 depends_on

解决容器的依赖、启动先后的问题。以下例子中会先启动 `redis` `db` 再启动 `web`
**注：**`web` 服务不会等待 `redis` `db` 「完全启动」之后才启动

```yml
version: "3"
services:
  web:
    build: .
    ports:
      - "5000:5000"
    command: python app.py
    volumes:
      - .:/code
    depends_on:
      - redis
      - db
	
  redis:
    image: redis:alpine
    
  db:
    image: postgres
    environment:
      POSTGRES_PASSWORD: 'postgres'
```

#### 2.4.10 expose

暴露端口，但不映射到宿主机，只被连接的服务访问。
仅可以指定内部端口为参数：

```yml
version: "3"
services:
  web:
    build: .
    ports:
      - "5000:5000"
    command: python app.py
    expose:
      - "3000"
      - "8000"

  redis:
    image: redis:alpine
```

#### 2.4.11 secrets

存储敏感数据，例如密码，密码存储有两种方式 **（推荐使用第二种）**：

1. 文件存储，例如`my_secret.txt`

2. Docker命令行工具`docker secret`存储

**注 ：第二种方式，只有在使用 Docker Swarm 时，才可以使用**

- 在`docker-compose.yml`中使用密钥

```yml
version: "3"
services:
  web:
    build: .
    ports:
      - "5000:5000"
    command: python app.py
    volumes:
      - .:/code
    depends_on:
      - redis
      - db
	
  redis:
    image: redis:alpine
    
  db:
    image: mysql
    environment:
      MYSQL_ROOT_PASSWORD_FILE: /run/secrets/db_root_password
    secrets:
      - db_root_password
  
  secrets:
    db_root_password:
      external: true 
```

**注：**`Docker Swarm` 集群时，会把密钥全部存放到容器的 `/run/secrets/` 目录下

### 2.5 Python项目演示

下列例子是使用 `Docker Compose` 配置并运行一个 `Django/PostgreSQL` 应用

#### 2.5.1 创建Dockerfile

python项目的Dockerfile如下：

```dockerfile
FROM python:3
ENV PYTHONUNBUFFERED 1
WORKDIR /code
COPY . /code/
RUN pip install -r requirements.txt
```

**解析：** 创建一个python镜像，在镜像中创建`/code`目录，将当前目录中的文件拷贝到镜像中的`/code`目录下，并安装python项目依赖

#### 2.5.2 创建requirements.txt

在 `requirements.txt` 文件里面写明需要安装的具体依赖包名

```
Django>=2.0,<3.0
psycopg2>=2.7,<3.0
```

#### 2.5.3 创建docker-compose.yml

`docker-compose.yml` 文件将把所有的东西关联起来。它描述了应用的构成（一个 web 服务和一个数据库）、使用的 Docker 镜像、镜像之间的连接、挂载到容器的卷，以及服务开放的端口

```yml
version: "3"
services:

  db:
    image: postgres
    environment:
      POSTGRES_PASSWORD: 'postgres'

  web:
    build: .
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - .:/code
    ports:
      - "8000:8000"
```

**解析：** 因yml配置文件中`web`服务使用的`build`参数，所以我们需先手动输入命令构建自定义镜像

#### 2.5.4 构建镜像

- 使用 `docker-compose run` 命令启动 `docker-compose.yml` 的`web`服务镜像

```bas
docker-compose run web django-admin startproject django_example .
```

**解析：** 因 `docker-compose.yml` 文件中没有配置`image`，而是配置了`build`，则会根据当前项目目录中的`Dockerfile`文件构建镜像，构建时，会在镜像中执行命令`django-admin startproject django_example`，在镜像的`WORKDIR`目录中创建Django项目。因 `docker-compose.yml` 文件中配置了 `volumes` 参数，会把镜像中的 `django_example` 文件夹拷贝一份到当前项目目录

- 给拷贝的文件修改权限

```bash
sudo chown -R $USER:$USER .
```

- 修改拷贝到本地的`django_example/settings.py` 文件中 `DATABASES = ...`配置

```bash
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres',
        'USER': 'postgres',
        'HOST': 'db',
        'PORT': 5432,
        'PASSWORD': 'postgres',
    }
}
```

#### 2.5.5 启动 Docker Compose 服务

- 运行 `docker-compose up`

```bash
docker-compose up

Creating docker_django_db_1  ... done
Creating docker_django_web_1 ... done
Attaching to docker_django_web_1, docker_django_db_1
```

打开 `127.0.0.1:8000` 即可看到 `Django` 欢迎页面。

- 执行`Django`数据库迁移命令

​**注：** 打开另外一个终端执行如下命令

```bash
docker-compose run web python manage.py migrate
```
