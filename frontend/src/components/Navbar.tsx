import React, { useState } from "react";

const NavBar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('HOME');
  const [isRoleOpen, setIsRoleOpen] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string>('User Verifier');

  const navStyle: React.CSSProperties = {
    width: '250px',
    height: '100vh',
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '20px',
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '30px',
    color: '#3498db'
  };

  const itemStyle: React.CSSProperties = {
    padding: '10px',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'background-color 0.3s'
  };

  const roleStyle: React.CSSProperties = {
    padding: '10px',
    cursor: 'pointer',
    borderRadius: '5px',
    backgroundColor: '#3498db',
    position: 'relative'
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '100%',
    left: '0',
    width: '100%',
    backgroundColor: '#34495e',
    borderRadius: '5px',
    marginBottom: '5px',
    display: isRoleOpen ? 'block' : 'none'
  };

  const dropdownItemStyle: React.CSSProperties = {
    padding: '8px 10px',
    cursor: 'pointer'
  };

  const handleItemClick = (item: string): void => {
    setActiveItem(item);
  };

  const handleRoleClick = (): void => {
    setIsRoleOpen(!isRoleOpen);
  };

  const handleRoleSelect = (role: string): void => {
    setSelectedRole(role);
    setIsRoleOpen(false);
  };

  return (
    <div style={navStyle}>
      <div style={titleStyle}>
        CREDIT APP
      </div>

      <div 
        style={{
          ...itemStyle,
          backgroundColor: activeItem === 'HOME' ? '#34495e' : 'transparent'
        }} 
        onClick={() => handleItemClick('HOME')}
      >
        HOME
      </div>

      <div 
        style={{
          ...itemStyle,
          backgroundColor: activeItem === 'PAYMENTS' ? '#34495e' : 'transparent'
        }} 
        onClick={() => handleItemClick('PAYMENTS')}
      >
        PAYMENTS
      </div>

      <div
        style={{
          ...itemStyle,
          backgroundColor: activeItem === 'BUDGET' ? '#34495e' : 'transparent'
        }}
        onClick={() => handleItemClick('BUDGET')}
      >
        BUDGET
      </div>

      <div 
        style={{
          ...itemStyle,
          backgroundColor: activeItem === 'CARD' ? '#34495e' : 'transparent'
        }} 
        onClick={() => handleItemClick('CARD')}
      >
        CARD
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div style={{
          padding: '10px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          🔔 Notification
        </div>
        <div style={{
          padding: '10px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          ✉️ Messages
        </div>
        <div style={{
          padding: '10px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          👤 Profile
        </div>
      </div>

      <div style={roleStyle} onClick={handleRoleClick}>
        ROLE: {selectedRole}
        <div style={dropdownStyle}>
          <div 
            style={dropdownItemStyle}
            onClick={() => handleRoleSelect('User Verifier')}
          >
            User Verifier
          </div>
          <div 
            style={dropdownItemStyle}
            onClick={() => handleRoleSelect('Admin')}
          >
            Admin
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;