# BigData
This project simulate a chain of ice-cream shops.  
The project is built from 3 sub-systems:  
## Simulator:
- Simulates orders of ice creams from various branches.  
## Dashboard:
- Present the stock of ice cream both in each branch sperately and in all the branches combined (data is stored on Reddis).
- Present prediction for future sales.
## Data storage:
- Store in mysql all the relevent data about each branch (the data is taken from APIs).
- For each sale it stores the details of the sale on mongoDB and add information about the weather on that day and wether there is a holiday or not.
- Make a prediction about future sales using BigML.

All the sub-systems communicate using Kafka.
![WhatsApp Image 2022-11-13 at 09 16 26](https://user-images.githubusercontent.com/85555432/201515552-3638f3a4-cc29-4d20-9e33-28be0962ffc1.jpeg)
![WhatsApp Image 2022-11-13 at 09 16 25](https://user-images.githubusercontent.com/85555432/201515554-3450030f-6c5e-4168-8559-60f324a5f991.jpeg)
![WhatsApp Image 2022-11-13 at 09 16 25 (1)](https://user-images.githubusercontent.com/85555432/201515556-de79808e-ed3c-4e09-ad92-e8323e9854f0.jpeg)
