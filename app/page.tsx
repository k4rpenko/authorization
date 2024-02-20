"use client"
import { useEffect } from "react";

export default function Home() {
  const redirectToAnotherSite = () => {
    const targetSiteURL = 'http://localhost:3000/register';
    window.location.href = targetSiteURL;
  };

  useEffect(() => {
    redirectToAnotherSite();
  }, []);
  
  return (
    <div>
    </div>
  );
}
