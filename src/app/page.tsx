"use client"
import React from "react";
import { useState } from "react";

export default function Home() {
  // Define types for state variables
  interface User {
    firstName: string;
    lastName: string;
    birthdate: Date | null;
    age: number | null;
  }

  // Initialize state variables
  const [users, setUsers] = useState<User[]>([]);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [birthdate, setBirthdate] = useState<string>("");
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  const [relationships, setRelationships] = useState<string[]>([]);

  // Function to calculate age from birthdate
  const calculateAge = (birthdate: Date | null): number | null => {
    if (!birthdate) return null;

    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Function to handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!firstName || !lastName || !birthdate) {
      alert("İsim, soyisim ve doğum tarihi alanları boş bırakılamaz.");
      return;
    }

    // Check if birthdate is valid
    const enteredBirthdate = new Date(birthdate);
    const maxAllowedDate = new Date();
    maxAllowedDate.setFullYear(maxAllowedDate.getFullYear() - 130);

    if (enteredBirthdate >= new Date() || enteredBirthdate < maxAllowedDate) {
      alert("Geçersiz doğum tarihi.");
      return;
    }

    // Create a new user object
    const newUser: User = {
      firstName: firstName,
      lastName: lastName,
      birthdate: new Date(birthdate),
      age: calculateAge(new Date(birthdate))
    };

    // Update the users state with the new user
    setUsers([...users, newUser]);

    // Reset form fields
    setFirstName("");
    setLastName("");
    setBirthdate("");
  };

  // Function to display users
  const displayUsers = () => {
    if (users.length >= 3) {
      // Calculate age for each user
      const usersWithAge = users.map(user => ({
        ...user,
        age: calculateAge(user.birthdate)
      }));

      // Filter out users with null ages
      const usersWithValidAge = usersWithAge.filter(user => user.age !== null);

      if (usersWithValidAge.length < 3) {
        alert("En az 3 kullanıcı girmelisiniz.");
        return;
      }

      // Sort users by age
      const sortedUsers = usersWithValidAge.sort((a, b) => {
        if (a.age === null || b.age === null) return 0;
        return a.age - b.age;
      });

      // Update displayed users with sorted users
      setDisplayedUsers(sortedUsers);

      // Determine relationships and display symbols
      const relationships = sortedUsers.map((user, index) => {
        if (index < sortedUsers.length - 1) {
          if (user.age !== null && sortedUsers[index + 1].age !== null) {
            if (user.age < sortedUsers[index + 1].age) {
              return '<';
            } else if (user.age > sortedUsers[index + 1].age) {
              return '>';
            } else {
              return '=';
            }
          }
        }
        return '';
      });

      setRelationships(relationships); // Set relationships
    } else {
      alert("En az 3 kullanıcı girmelisiniz.");
    }
  };

  return (
    <main className="text-base flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-cyan-500 to-blue-500">
      <div className="container w-90 bg-white p-8 shadow-lg border-2 border-blue-500 rounded-lg">

        <form id="userForm" onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-bold mb-1">İsim:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-bold mb-1">Soyisim:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="birthdate" className="block text-sm font-bold mb-1">Doğum Tarihi:</label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded-md mr-4">Kullanıcı Ekle</button>
          <button type="button" onClick={displayUsers} className="bg-gray-500 text-white px-4 py-2 rounded-md">Kullanıcıları Göster</button>
        </form>

        <div id="userList" className="flex flex-col items-center md:justify-start">
          <table>
            <tbody>
              <tr>
                {displayedUsers.map((user, index) => (
                  <React.Fragment key={index}>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.age} Yaşında</td>
                    {index < displayedUsers.length - 1 && <td>{relationships[index]}</td>}
                  </React.Fragment>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

