# Portone Assignment

## Description

This project implements backend APIs for Stripe Payment Gateway integration. It provides functionality to create payment intents, capture intents, create refunds, and get a list of all intents using the Stripe API.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Mallikarjuna-dev/portone-assignment.git
   cd your-repo
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up Stripe Sandbox Account:

   - Create an account on Stripe Dashboard.
   - Obtain your Stripe Access Keys and Secret Keys.

4. Create a `.env` file in the root directory:

   ```
   STRIPE_SECRET_KEY=your-stripe-secret-key
   MONGODB_URL=your-mongodb-connection-link
   PORT=3000  # Set your desired port
   ```

## Usage

1. Run the application:

   ```bash
   npm run start
   ```

2. Access the APIs:
   - Create Intent: `POST /api/v1/create_intent`
   - Capture Intent: `POST /api/v1/capture_intent/:id`
   - Create Refund: `POST /api/v1/create_refund/:id`
   - Get List of Intents: `GET /api/v1/get_intents`

## Configuration

Configure Stripe keys in the `.env` file.

## Deployed Link

https://portone-assignment-ownk.onrender.com

## Swagger

<!-- https://portone.onrender.com/api-docs -->

https://portone-assignment-ownk.onrender.com/api-docs/

## Postman Link
https://winter-crescent-303993.postman.co/workspace/Team-Workspace~95f1876e-0fd4-4092-8bb6-f7548064da03/collection/19126737-6a33d8fc-15ed-4660-81c9-8ac025eb4dd5?action=share&creator=19126737
