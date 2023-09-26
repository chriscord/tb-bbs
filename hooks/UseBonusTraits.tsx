import React, { createContext, useState, useContext } from 'react';

export const TraitBonusContext = createContext();

export const TraitBonusProvider = ({ children }) => {
  const [traitBonuses, setTraitBonuses] = useState({
    // initial values
  });

  const updateTraitBonuses = (newBonuses: React.SetStateAction<{}>) => {
    setTraitBonuses(newBonuses);
  };

  return (
    <TraitBonusContext.Provider value={{ traitBonuses, updateTraitBonuses }}>
      {children}
    </TraitBonusContext.Provider>
  );
};

export const useTraitBonuses = () => {
  return useContext(TraitBonusContext);
};
