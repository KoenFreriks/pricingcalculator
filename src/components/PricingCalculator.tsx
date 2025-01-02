import React, { useState, useEffect } from 'react';
import { Users, Euro } from 'lucide-react';

interface PricingTier {
  maxUsers: number;
  pricePerUser: number;
}

const BASE_FEE = 200;
const MIN_USERS = 100;
const IMPLEMENTATION_FEE_SELF = 2500;
const IMPLEMENTATION_FEE_ASSISTED = 3500;
const IMPLEMENTATION_FEE_FULL = 5000;

const pricingTiers: PricingTier[] = [
  { maxUsers: 500, pricePerUser: 1.41 },
  { maxUsers: 1000, pricePerUser: 1.06 },
  { maxUsers: Infinity, pricePerUser: 0.79 },
];

type ImplementationType = 'self' | 'assisted' | 'full';

const PricingCalculator: React.FC = () => {
  const [users, setUsers] = useState<number>(MIN_USERS);
  const [implementationType, setImplementationType] = useState<ImplementationType>('assisted');
  const [monthlyPrice, setMonthlyPrice] = useState<number>(BASE_FEE);
  const [implementationFee, setImplementationFee] = useState<number>(IMPLEMENTATION_FEE_ASSISTED);

  useEffect(() => {
    let price = BASE_FEE;
    let remainingUsers = users;

    for (const tier of pricingTiers) {
      const usersInTier = Math.min(remainingUsers, tier.maxUsers - (tier === pricingTiers[0] ? 0 : pricingTiers[pricingTiers.indexOf(tier) - 1].maxUsers));
      price += usersInTier * tier.pricePerUser;
      remainingUsers -= usersInTier;
      if (remainingUsers <= 0) break;
    }

    setMonthlyPrice(price);

    const fees = {
      self: IMPLEMENTATION_FEE_SELF,
      assisted: IMPLEMENTATION_FEE_ASSISTED,
      full: IMPLEMENTATION_FEE_FULL,
    };
    setImplementationFee(fees[implementationType]);
  }, [users, implementationType]);

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setUsers(isNaN(value) ? MIN_USERS : Math.max(MIN_USERS, value));
  };

  const handleImplementationChange = (type: ImplementationType) => {
    setImplementationType(type);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Prijscalculator</h2>
      <div className="mb-6">
        <label htmlFor="users" className="block text-sm font-medium text-gray-700 mb-2">
          Aantal gebruikers (minimum {MIN_USERS})
        </label>
        <div className="flex items-center">
          <Users className="mr-2 h-5 w-5 text-gray-400" />
          <input
            type="number"
            id="users"
            value={users}
            onChange={handleUserChange}
            min={MIN_USERS}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fe904d]"
          />
        </div>
      </div>
      <div className="mb-6 space-y-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Implementatie type</label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              checked={implementationType === 'self'}
              onChange={() => handleImplementationChange('self')}
              className="mr-2 accent-[#fe904d]"
            />
            <span className="text-sm font-medium text-gray-700">Zelf-implementatie</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={implementationType === 'assisted'}
              onChange={() => handleImplementationChange('assisted')}
              className="mr-2 accent-[#fe904d]"
            />
            <span className="text-sm font-medium text-gray-700">Begeleide implementatie</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={implementationType === 'full'}
              onChange={() => handleImplementationChange('full')}
              className="mr-2 accent-[#fe904d]"
            />
            <span className="text-sm font-medium text-gray-700">Volledig ontzorgd</span>
          </label>
        </div>
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
          <span className="font-semibold mr-1">Basiskosten:</span>
          <Euro className="mr-1 h-4 w-4" />
          {BASE_FEE}/maand
        </p>
        <p className="mb-1">Prijsniveaus per gebruiker:</p>
        <ul className="list-disc list-inside ml-2">
          <li>Eerste 500 gebruikers: €1,41 per gebruiker/maand</li>
          <li>Volgende 500 gebruikers: €1,06 per gebruiker/maand</li>
          <li>Extra gebruikers: €0,79 per gebruiker/maand</li>
        </ul>
      </div>
    </div>
  );
};

export default PricingCalculator;