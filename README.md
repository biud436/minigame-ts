# Introduction

This is a simple game engine written in TypeScript.

<p align="center">
<img src="https://user-images.githubusercontent.com/13586185/218744889-f51e1059-8972-438a-a8f1-4b2b748a5737.gif" width="400" />
<img src="https://user-images.githubusercontent.com/13586185/218754079-01db958b-aaa3-410f-904d-dffabd4e0954.gif" width="400" />

</p>

## Structure

App (Main Entry Point) -> Finite State Machine -> Render Clear -> Update States -> Update Game Objects -> Render States -> Render Game Objects

# Setup

before you start, make sure you have [yarn](https://yarnpkg.com/) installed and then run the following commands in your terminal:

```sh
yarn install
```

# How to run

## Client

next you can run the following command to start the development server:

```sh
yarn workspace client dev

# or

cd client
yarn dev
```

### Build

```sh
yarn workspace client build

# or

cd client
yarn build
```

## Server

```sh
yarn workspace server start:dev

# or
cd server
yarn start:dev
```
