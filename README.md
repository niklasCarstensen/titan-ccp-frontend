# Titan CCP - Visualization Frontend

The [Titan Control Center Prototype](http://eprints.uni-kiel.de/43910) (CCP) is a
scalable monitoring infrastructure for [Industrial DevOps](https://industrial-devops.org/).
It allows to monitor, analyze and visualize the electrical power consumption of
devices and machines in production environments such as factories.

This repository contains the visualization frontend of the Titan CCP. It is a
single-page application written in Typescript and Vue.js.



## Developing

To work with this project, clone this repository and execute:

```shell
npm install
```

To start a development server execute:

```shell
npm run dev
```

A good tool for working on this software is [Visual Studio Code](https://code.visualstudio.com/).
In order to get things like autocomletion for `.vue` files, you need to install the [vetur](https://vuejs.github.io/vetur/) plugin.
When you open a vue file the first time, Visual Studio Code suggests to install this plugin.

## Building

To build it for use in production execute:

```shell
npm install
npm run build
```

This will create some files in `dist`. These files along with the `index.html`
can then be copied on a web server for productive usage.

This repository also contains a Dockerfile. Adjust the `nginx.conf` file accordingly
and run `docker build -t titan-ccp-frontend .` to create an image from it (after
building it with npm).

## Running

To start a container execute:

```
docker run --rm --name titan-ccp-frontend -p <port>:8080 -e "CONFIGURATION_BASE_URL=http://<host>:<port>" -e "HISTORY_BASE_URL=http://<host>:<port>" -d titan-ccp-frontend
```