import {useEffect,useState} from "react";
import API from "../services/api";

function CrisisHistoryCard(){

const user =
JSON.parse(
localStorage.getItem("user")
);

const [history,setHistory] =
useState([]);

useEffect(()=>{

fetchHistory();

},[]);

const fetchHistory = async()=>{

const response =
await API.get(
`/crisis-history/${user.email}`
);

setHistory(
response.data
);

};

return (

<div
className="
bg-gradient-to-br
from-orange-50
to-amber-50
rounded-[35px]
p-8
"
>

<h2
className="
text-2xl
sm:text-3xl
lg:text-4xl
font-bold
text-orange-600
mb-6
"
>
Crisis History
</h2>


{
history.length===0 ?

<div
className="
text-center
py-16
"
>

<p className="text-gray-500 text-lg">
No crisis events recorded.
</p>

<p className="text-gray-400 mt-2">
You're doing great!
</p>

</div>

:

<div
className="
space-y-6
max-w-3xl
mx-auto
"
>

{

history.map(item=>(

<div
key={item._id}
className="
relative
pl-8
sm:pl-12
"
>

<div
className="
absolute
left-4
top-0
bottom-0
w-[3px]
bg-orange-200
rounded-full
"
/>

<div
className="
absolute
left-[7px]
top-5
w-5
h-5
rounded-full
bg-orange-500
border-4
border-orange-100
"
/>

<div
className="
bg-white
rounded-[24px]
sm:rounded-3xl
shadow-lg
border border-orange-100
p-4
sm:p-6
"
>

<div
className="
flex
flex-col
sm:flex-row
gap-4
sm:justify-between
sm:items-center
mb-5
"
>

<div
className={`

px-4
py-2
rounded-full
font-semibold

${
item.riskLevel==="High"
?

"bg-red-100 text-red-600"

:

item.riskLevel==="Moderate"

?

"bg-yellow-100 text-yellow-700"

:

"bg-green-100 text-green-600"

}

`}
>

{item.riskLevel}

</div>

<div
className="
bg-orange-50
text-orange-600
px-4
py-2
rounded-full
font-semibold
"
>

{

new Date(
item.createdAt
).toLocaleDateString()

}

</div>

</div>


<div
className="
bg-gray-50
rounded-2xl
p-5
"
>

<h3
className="
font-bold
text-gray-700
mb-3
"
>

AI Observation

</h3>

<p
className="
text-sm
sm:text-base
text-gray-600
leading-7
"
>

{item.reason}

</p>

</div>

</div>

</div>

))

}

</div>
}

</div>

);

}

export default CrisisHistoryCard;