"use client";
import { useState } from "react";

export default function Home() {

  // Define types for state variables
  interface User {
    firstName: string;
    lastName: string;
    birthdate: Date | null;
  }

  // Initialize state variables
  const [users, setUsers] = useState<User[]>([]);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [birthdate, setBirthdate] = useState<string>("");
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  const [relationships, setRelationships] = useState<string[]>([]);

  // Function to handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!firstName || !lastName || !birthdate) {
      alert("Please fill in all fields.");
      return;
    }

    // Create a new user object
    const newUser: User = {
      firstName: firstName,
      lastName: lastName,
      birthdate: new Date(birthdate) // Convert birthdate string to Date object
    };

    // Update the users state with the new user
    setUsers([...users, newUser]);

    // Reset form fields
    setFirstName("");
    setLastName("");
    setBirthdate(""); // Reset birthdate to an empty string
  };

  // Function to display users
  const displayUsers = () => {
    if (users.length >= 3) {
      // Sort users by age
      const sortedUsers = [...users].sort((a, b) =>{
        if (!a.birthdate && !b.birthdate) return 0;
        if (!a.birthdate) return 1;
        if (!b.birthdate) return -1;
        return a.birthdate.getTime() - b.birthdate.getTime();
      });

      // Update displayed users with sorted users
      setDisplayedUsers(sortedUsers);

      // Determine relationships and display symbols
      const relationships = [];
      for (let i = 0; i < sortedUsers.length - 1; i++) {
        const currentBirthdate = sortedUsers[i]?.birthdate;
        const nextBirthdate = sortedUsers[i + 1]?.birthdate;
  
        if (currentBirthdate && nextBirthdate) {
          if (currentBirthdate < nextBirthdate) {
            relationships.push('>');
          } else if (currentBirthdate > nextBirthdate) {
            relationships.push('<');
          } else {
            relationships.push('=');
          }
        } else {
          relationships.push('');
        }
      }
      setRelationships(relationships);
    } else {
      alert("You need at least 3 users to display.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-cyan-500 to-blue-500">
      <div className="container w-90 bg-white p-8 shadow-lg border-2 border-blue-500 rounded-lg">

        <form id="userForm" onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-bold mb-1">First Name:</label>
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
            <label htmlFor="lastName" className="block text-sm font-bold mb-1">Last Name:</label>
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
            <label htmlFor="birthdate" className="block text-sm font-bold mb-1">Birthdate:</label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded-md mr-4">Add User</button>
          <button type="button" onClick={displayUsers} className="bg-gray-500 text-white px-4 py-2 rounded-md">Display Users</button>
        </form>

        <div id="userList" className=" text-left ">
          {displayedUsers.map((user, index) => (
            <div key={index} className="mb-2">
              <p><span className="font-bold">Name:</span> {user.firstName} {user.lastName}</p>
              <p><span className="font-bold">Birthdate:</span> {user.birthdate ? user.birthdate.toDateString() : "N/A"}</p>
              {index < relationships.length && <p>{relationships[index]}</p>}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}