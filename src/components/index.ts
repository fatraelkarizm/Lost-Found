import React from "react";

const ContactFinders = React.lazy(() => import("./ContactFinders"));
const FeaturedItems = React.lazy(() => import("./FeaturedItems"));
const Footer = React.lazy(() => import("./Footer"));
const HeroSection = React.lazy(() => import("./HeroSection"));
const HowItWorks = React.lazy(() => import("./HowItWorks"));
const ItemModal = React.lazy(() => import("./ItemModal"));
const Navbar = React.lazy(() => import("./Navbar"));
const SearchFilter = React.lazy(() => import("./SearchFilter"));
const SuccessStories = React.lazy(() => import("./SuccessStories"));

export {
  ContactFinders,
  FeaturedItems,
  Footer,
  HeroSection,
  HowItWorks,
  ItemModal,
  Navbar,
  SearchFilter,
  SuccessStories
};