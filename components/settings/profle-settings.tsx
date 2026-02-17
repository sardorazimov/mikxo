/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

export default function ProfileSettings({
  user
}: {
  user: any
}) {

  const [username, setUsername] =
    useState(user?.username ?? "");

  const [bio, setBio] =
    useState(user?.bio ?? "");

  async function save() {

    await fetch(
      "/api/users/update",
      {
        method: "POST",

        body: JSON.stringify({

          username,
          bio,

        })

      }
    );

  }

  return (

    <div>

      <input
        value={username}
        onChange={(e)=>
          setUsername(e.target.value)
        }
      />

      <textarea
        value={bio}
        onChange={(e)=>
          setBio(e.target.value)
        }
      />

      <button onClick={save}>
        Save
      </button>

    </div>

  );

}
