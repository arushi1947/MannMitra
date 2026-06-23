function EmergencyCard(){

return (

<div
className="
bg-gradient-to-br
from-red-50
to-pink-50

rounded-[25px]
sm:rounded-[35px]

p-5
sm:p-8
"
>

<h2
className="
text-2xl
sm:text-3xl
lg:text-4xl
font-bold
text-red-600
mb-8
"
>
Emergency Support
</h2>


<div
className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-5
sm:gap-6
"
>

<div
className="
bg-white
rounded-3xl
p-5 sm:p-6
shadow-md
border
border-red-100
"
>

<h3
className="
text-xl sm:text-2xl
font-bold
text-gray-800
"
>
KIRAN
</h3>

<p className="text-gray-500 mt-2">
24×7 Mental Health Helpline
</p>

<p
className="
text-lg
sm:text-xl
lg:text-2xl
break-all
font-semibold
text-red-500
mt-4
"
>
1800-599-0019
</p>

<a
href="tel:18005990019"
className="
mt-6
inline-block
bg-gradient-to-r
from-red-500
to-pink-500
text-white
w-full
py-3
rounded-full
font-semibold
text-center
"
>
Call Now
</a>

</div>

<div
className="
bg-white
rounded-3xl
p-5 sm:p-6
shadow-md
border
border-red-100
"
>

<h3
className="
text-xl sm:text-2xl
font-bold
text-gray-800
"
>
AASRA
</h3>

<p className="text-gray-500 mt-2">
Suicide Prevention Helpline
</p>

<p
className="
text-lg
sm:text-xl
lg:text-2xl
break-all
font-semibold
text-red-500
mt-4
"
>
+91 22 27546669
</p>

<a
href="tel:+912227546669"
className="
mt-6
inline-block
bg-gradient-to-r
from-red-500
to-pink-500
text-white
w-full
py-3
rounded-full
font-semibold
text-center
"
>
Call Now
</a>

</div>

<div
className="
bg-white
rounded-3xl
p-5 sm:p-6
shadow-md
border
border-red-100
"
>

<h3
className="
text-xl sm:text-2xl
font-bold
text-gray-800
"
>
Emergency
</h3>

<p className="text-gray-500 mt-2">
National Emergency Number
</p>

<p
className="
text-2xl
sm:text-3xl
font-bold
text-red-500
mt-4
"
>
112
</p>

<a
href="tel:112"
className="
mt-6
inline-block
bg-gradient-to-r
from-red-500
to-pink-500
text-white
w-full
text-center
py-3
rounded-full
font-semibold
"
>
Call Now
</a>

</div>

</div>


<div
className="
mt-8

bg-red-100

rounded-[25px]

p-4
sm:p-5

text-center
"
>

<p
className="
text-red-700
font-medium

text-sm
sm:text-base

leading-7
"
>

You are not alone. If you're experiencing distress or crisis, please reach out immediately to someone you trust or use one of the helplines above.

</p>

</div>

</div>

);

}

export default EmergencyCard;