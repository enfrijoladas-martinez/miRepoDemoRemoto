import Stripe from "stripe"
import { STRIPE_KEY } from "../config.js"
const stripe = new Stripe(STRIPE_KEY)

export const procesarPago = async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          product_data: { name: 'Laptop Gamer', description: 'RTX 4070, 32GB RAM' },
          currency: 'mxn', unit_amount: 25000
        }, quantity: 1
      },
      {
        price_data: {
          product_data: { name: 'Mouse RGB', description: 'Logitech G Pro' },
          currency: 'mxn', unit_amount: 1500
        }, quantity: 2
      }
    ],
    mode: "payment",
    success_url: 'http://localhost:5000/exito',
    cancel_url: 'http://localhost:5000/cancelado'
  })
  res.json(session)
}
