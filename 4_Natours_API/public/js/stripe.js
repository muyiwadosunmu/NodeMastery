import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51NG2RRK44cttteEn1BjVIKqymsedUrwTsduobAYaGSa8TztNZ8aavDqX2XvYKctyrR17TvzDwSQoMya1fWNmJqHk00ScMmBSob'
);

export const bookTour = async (tourId) => {
  //1 Get the session from the server(the API)
  try {
    const session = await axios(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);
    //2 Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    console.log(error);
    showAlert('error', error);
  }
};
