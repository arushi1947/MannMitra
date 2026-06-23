import { useEffect, useState } from "react";
import API from "../services/api";

function TrustedContactsCard() {

  const user =
  JSON.parse(
    localStorage.getItem("user")
  );

  const [contacts, setContacts] =
  useState([]);

  const [name, setName] =
  useState("");

  const [phone, setPhone] =
  useState("");

  const [relationship, setRelationship] =
  useState("");

  useEffect(() => {

    fetchContacts();

  }, []);

  const fetchContacts = async () => {

    try {

      const response =
      await API.get(
        `/trusted-contact/${user.email}`
      );

      setContacts(
        response.data
      );

    }

    catch (error) {

      console.log(error);

    }

  };

  const addContact = async () => {

    if (
      !name ||
      !phone
    ) return;

    try {

      await API.post(
        "/trusted-contact",
        {

          userEmail:
          user.email,

          name,

          phone,

          relationship

        }
      );

      setName("");
      setPhone("");
      setRelationship("");

      fetchContacts();

    }

    catch (error) {

      console.log(error);

    }

  };

  const deleteContact = async (id) => {

    try {

      await API.delete(
        `/delete-trusted-contact/${id}`
      );

      fetchContacts();

    }

    catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="h-full flex flex-col">

    <h2
    className="
    text-2xl
    sm:text-3xl
    font-bold
    text-pink-600
    mb-8
    "
    >
    Trusted Contacts
    </h2>


    <div
    className="
    flex-1

    grid
    grid-cols-1
    xl:grid-cols-2

    gap-6
    lg:gap-8

    overflow-hidden
    "
    >

    <div
    className="
    bg-pink-50
    p-5
    sm:p-8

    rounded-[25px]
    sm:rounded-[35px]

    shadow-lg

    sticky
    top-0
    "
    >

    <h3
    className="
    text-xl
    sm:text-2xl
    font-bold
    text-pink-600
    mb-6
    "
    >
    Add New Contact
    </h3>

    <input
    type="text"
    placeholder="Name"
    value={name}
    onChange={(e)=>setName(e.target.value)}
    className="
    w-full
    px-4
    sm:px-5

    py-3
    sm:py-4

    rounded-xl
    sm:rounded-2xl

    text-sm
    sm:text-base
    border
    border-pink-100
    bg-white
    outline-none
    focus:ring-2
    focus:ring-pink-400
    mb-4
    "
    />

    <input
    type="text"
    placeholder="Phone Number"
    value={phone}
    onChange={(e)=>setPhone(e.target.value)}
    className="
    w-full
    px-4
    sm:px-5

    py-3
    sm:py-4

    rounded-xl
    sm:rounded-2xl

    text-sm
    sm:text-base
    border
    border-pink-100
    bg-white
    outline-none
    focus:ring-2
    focus:ring-pink-400
    mb-4
    "
    />

    <input
    type="text"
    placeholder="Relationship"
    value={relationship}
    onChange={(e)=>
    setRelationship(e.target.value)
    }
    className="
    w-full
    px-4
    sm:px-5

    py-3
    sm:py-4

    rounded-xl
    sm:rounded-2xl

    text-sm
    sm:text-base
    border
    border-pink-100
    bg-white
    outline-none
    focus:ring-2
    focus:ring-pink-400
    "
    />

    <button
    onClick={addContact}
    className="
    mt-6
    w-full
    sm:w-auto

    px-8
    py-3
    rounded-full
    bg-gradient-to-r
    from-purple-600
    to-pink-500
    text-white
    font-semibold
    shadow-lg
    hover:scale-105
    transition-all
    cursor-pointer
    "
    >
    Add Contact
    </button>

    </div>

    <div className="flex flex-col overflow-hidden">

    <h3
    className="
    text-xl
    sm:text-2xl
    font-bold
    text-gray-800
    mb-6
    "
    >
    Saved Contacts
    </h3>

    {
    contacts.length===0 ?

    <div
    className="
    bg-white
    rounded-[25px]
    sm:rounded-[30px]

    p-6
    sm:p-10
    shadow-lg
    text-center
    "
    >

    <p className="text-gray-500">
    No trusted contacts yet
    </p>

    </div>

    :

    <div
    className="
    space-y-5

    flex-1

    overflow-y-auto

    pr-2
    "
    >

    {

    contacts.map(contact=>(

    <div
    key={contact._id}
    className="
    bg-white
    rounded-[25px]
    sm:rounded-[30px]

    p-5
    sm:p-6
    shadow-lg
    border
    border-gray-100
    "
    >

    <h3
    className="
    text-lg
    sm:text-xl
    font-bold
    text-gray-800
    "
    >
    {contact.name}
    </h3>

    <p
    className="
    text-pink-500
    font-medium
    mt-2
    "
    >
    {contact.relationship}
    </p>

    <p
    className="
    text-gray-500
    mt-1

    break-all
    text-sm
    sm:text-base
    "
    >
    📞 {contact.phone}
    </p>

    <button
    onClick={()=>
    deleteContact(contact._id)
    }
    className="
    mt-5
    w-full
    sm:w-auto
    text-left
    text-red-500
    font-medium
    hover:text-red-700
    transition
    cursor-pointer
    "
    >
    Delete
    </button>

    </div>

    ))

    }

    </div>

    }

    </div>

    </div>

    </div>

    );

}

export default TrustedContactsCard;