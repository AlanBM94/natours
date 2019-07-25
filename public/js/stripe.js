/* eslint-disable */
import axios from 'axios';
const stripe = Stripe('pk_test_QQOgozOcx7zPXqZrTEFXd2Da00zzU7D29i');
import { showAlert } from './alert';

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (error) {
    showAlert('error', error);
  }
};
