'use client';

import { useState } from 'react';

import { api } from '@/lib/api';

export default function SignupPage() {
  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [name, setName] =
    useState('');

  const [role, setRole] = useState(
    'MENTEE',
  );

  const handleSignup = async () => {
    try {
      await api.post('/auth/signup', {
        email,
        password,
        name,
        role,
      });

      alert('signup success');
    } catch (error) {
      console.error(error);

      alert('signup failed');
    }
  };

  return (
    <div className="flex flex-col gap-2 p-8">
      <h1>Signup</h1>

      <input
        placeholder="email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <input
        placeholder="name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <select
        value={role}
        onChange={(e) =>
          setRole(e.target.value)
        }
      >
        <option value="MENTOR">
          MENTOR
        </option>

        <option value="MENTEE">
          MENTEE
        </option>
      </select>

      <button onClick={handleSignup}>
        Signup
      </button>
    </div>
  );
}
