# A reproducible environment 

If you have a reproducible environment, you can recreate the environment :
with the same tools, software versions, and configuration.

# Use these tools to create a reproducible environment

## Docker

Use Docker to specify a container image.

A container image contains:

- a filesystem
- environment variables
- a run command

From this container image, create a new container. 

How do I create the container image?

Create a Dockerfile.  -- The Dockerfile specifies how to build the image. 

Specify the files to copy from the host system to the docker image. 

Specify which packages to install in the container - e.g. using apt if container is ubuntu 

a . Docker creates a new container -- this container is used as a base to build up the image 

b . Docker creates a filesystem layer for each command in the Dockerfile  --  Docker uses a union filesystem, (is this the same as overlays?)

c . Docker runs the command 

### Example Dockerfile


```
FROM node:12-alpine
RUN apk add --no-cache python g++ make
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "src/index.js"]
```

Dockerfile specifies node:12-alpine as the base image. 

node:12-alpine is made up of layers 

## Docker: Are Docker images reproducible? 

Run a Dockerfile build twice; you may get a third-party package that is different - it was upgraded!

Pin dependency versions? yes but what about sub - sub dependencies etc  ? 

## Docker: Issue of inheritance vs composition

Docker inherits from one base layer (e.g. from node:12-alpine), but does not allow inheritance of 2 layers.

e.g. if you want a container with both node and rustc, you can not combine a node image and a rust image. 

You must start with one image and specify the steps in the Dockerfile to install the other functionality.  

e.g. start wiht the node image as the base image, and specify rust as Dockerfile steps 



## Compare with Nix

Reproducible builds ; Reproducible package management. 

To build a package:

- specify all the tools needed to build a package.

- Make an environment with these tools available (you could drop into a shell environement here without going to the next step; then why not try the build steps yourself! )

- Nix reads a build script and builds the package. 


```
{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
    nativeBuildInputs = [ pkgs.rustc pkgs.cargo ];
}
```

Difference with Docker?

- no containers --  only modifies the env vars. 

-- rust and cargo binaries are added to the PATH environment variable.

I want node and rust in the same environment 


```
{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
    nativeBuildInputs = [ pkgs.rustc pkgs.cargo pkgs.nodejs-16_x ];
}
```


Nix : reproducibly build a package 
Nix : reproducibly create an environment

Docker: build, package, and deploy a service.  Containers are the way to deploy web services.

# Use nix to build a Docker image

```
{ pkgs ? import <nixpkgs> { }
, pkgsLinux ? import <nixpkgs> { system = "x86_64-linux"; }
}:

pkgs.dockerTools.buildImage {
  name = "cowsay-container";
  config = {
    Cmd = [ "${pkgsLinux.cowsay}/bin/cowsay" "I'm a container" ];
  };
}
```

- Nix --> gives a reproducible Docker image

- Docker -> a nice way to deploy the container 

see Replit Apps

A container provides a repl with an isolated environment

Nix : create a reproducible build 

Docker: create a containerized deployment

# refs

Mon Nov 29 2021 by Connor Brewster
