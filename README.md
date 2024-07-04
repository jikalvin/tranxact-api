# Crypto Trading App API

This API powers the backend functionality for the Crypto Trading App, providing authentication, user registration, and verification services, as well as fetching real-time cryptocurrency data.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Endpoints](#endpoints)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Server](#running-the-server)
- [Usage](#usage)
- [Authentication](#authentication)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The Crypto Trading App API is built to facilitate user authentication and interaction with cryptocurrency data. It allows users to register, verify their credentials, and perform authenticated actions within the app.

## Features

- User registration and authentication
- Email and phone verification
- Login and session management
- Fetch real-time cryptocurrency data
- Perform buy and sell transactions
- View transaction history and account balance

## Endpoints

### Authentication

- **POST /auth/register**: Register a new user with email, password, optional phone number, and referral code.
- **POST /auth/login**: Log in with either email and password or phone and password.
- **POST /auth/verify-email**: Verify user's email using the verification code.
- **POST /auth/verify-phone**: Verify user's phone number using the verification code.

### Cryptocurrency Data

- **GET /crypto/prices**: Fetch real-time prices of various cryptocurrencies.
- **GET /crypto/history**: Retrieve historical data for a specific cryptocurrency.

### User Management

- **GET /user**: Retrieve user profile information.
- **PUT /user**: Update user profile information.
- **DELETE /user**: Delete user account.

## Getting Started

### Prerequisites

Before running the server, ensure you have the following installed:

- Node.js
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your/repository.git
