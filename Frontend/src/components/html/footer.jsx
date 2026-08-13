import React from "react";

export const Footer = () => {
  return (
  
      <h1>this is footer</h1>
    
  );
};

const h1element=React.createElement('h1',null,'learn react')
export function SecondFooter() {
  return (
    
     <>
     {h1element}
     </>
    
  );
}
