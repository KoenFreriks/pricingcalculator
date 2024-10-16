import React, { useState, useEffect } from 'react';
import { Users, Euro } from 'lucide-react';

interface PricingTier {
  maxUsers: number;
  pricePerUser: number;
}

const BASE_FEE = 150;
const IMPLEMENTATION_FEE_SELF = 1500;
const IMPLEMENTATION_FEE_ASSISTED = 3500;
const MININIMUM_USERS = 100;
const pricingTiers: PricingTier[] = [
  { maxUsers: 500, pricePerUser: 1.41 },
  { maxUsers: 1000, pricePerUser: 1.06 },
  { maxUsers: Infinity, pricePerUser: 0.79 },
];

const PricingCalculator: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');  // Allow empty input as a string
  const [users, setUsers] = useState<number>(MININIMUM_USERS);
  const [isSelfImplementation, setIsSelfImplementation] = useState<boolean>(false);
  const [monthlyPrice, setMonthlyPrice] = useState<number>(BASE_FEE);
  const [implementationFee, setImplementationFee] = useState<number>(IMPLEMENTATION_FEE_ASSISTED);

  useEffect(() => {
    // Use minimum users if the input is empty or invalid
    const userCount = userInput === '' ? MININIMUM_USERS : Math.max(parseInt(userInput, 10) || MININIMUM_USERS, MININIMUM_USERS);
    let price = BASE_FEE;
    let remainingUsers = userCount;

    for (const tier of pricingTiers) {
      const usersInTier = Math.min(remainingUsers, tier.maxUsers - (tier === pricingTiers[0] ? 0 : pricingTiers[pricingTiers.indexOf(tier) - 1].maxUsers));
      price += usersInTier * tier.pricePerUser;
      remainingUsers -= usersInTier;
      if (remainingUsers <= 0) break;
    }

    setUsers(userCount);
    setMonthlyPrice(price);
    setImplementationFee(isSelfImplementation ? IMPLEMENTATION_FEE_SELF : IMPLEMENTATION_FEE_ASSISTED);
  }, [userInput, isSelfImplementation]);

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);  // Allow the input to be empty
  };

  const handleImplementationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSelfImplementation(e.target.checked);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Prijscalculator</h2>
      <div className="mb-6">
        <label htmlFor="users" className="block text-sm font-medium text-gray-700 mb-2">
          Aantal gebruikers
        </label>
        <div className="flex items-center">
          <Users className="mr-2 h-5 w-5 text-gray-400" />
          <input
            type="number"
            id="users"
            value={userInput}
            onChange={handleUserChange}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe904d]"
          />
        </div>
      </div>
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isSelfImplementation}
            onChange={handleImplementationChange}
            className="mr-2 accent-[#fe904d]"
          />
          <span className="text-sm font-medium text-gray-700">Zelf-implementeren</span>
        </label>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Maandelijkse kosten</h3>
        <p className="text-3xl font-bold text-[#fe904d] flex items-center">
          <Euro className="mr-1 h-8 w-8" />
          {monthlyPrice.toFixed(2)}/maand
        </p>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Implementatiekosten</h3>
        <p className="text-2xl font-bold text-[#fe904d] flex items-center">
          <Euro className="mr-1 h-6 w-6" />
          {implementationFee.toFixed(2)}
        </p>
      </div>
      <div className="text-sm text-gray-600">
        <p className="flex items-center mb-1">
          <span className="font-semibold mr-1">Basis service kosten:</span>
          <Euro className="mr-1 h-4 w-4" />
          {BASE_FEE}/maand
        </p>
        <p className="mb-1">Prijsniveaus per gebruiker:</p>
        <ul className="list-disc list-inside ml-2">
          <li>Eerste 500 gebruikers: €1,41 per gebruiker/maand</li>
          <li>Volgende 500 gebruikers: €1,06 per gebruiker/maand</li>
          <li>Extra gebruikers: €0,79 per gebruiker/maand</li>
          <p> 
          Minimale afname van 100 gebruikers
          </p>
          
        </ul>
      </div>
    </div>
  );
};

export default PricingCalculator;