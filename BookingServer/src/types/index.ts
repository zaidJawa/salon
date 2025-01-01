export type DecodedUser = {
  userId: string;
  role: string;
}


export type RegisterRequestBody = {
  email: string;
  password: string;
  phone: string;
  name: string;
}

export type LoginRequestBody = {
  email: string;
  phone: string;
  password: string;
}


export type Booking = {
  booking: {
    id: string;
    userId: string;
    beautySalonId: string;
    date: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  user: {
    name: string;
    email: string;
    phone: string;
  };
  services: {
    serviceName: string;
    servicePrice: number;
  }[];
  beautySalon: {
    id: string;
    name: string;
    location: string;
    phone: string;
  };
}

export type GeneratePdfOptions = {
  title?: string;
  bookings: Booking[];
};