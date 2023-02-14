# Introduction

This is a simple game engine written in TypeScript.

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

## Build

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
