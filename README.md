# Hotel Booking Brief
## 1. Basic Requirements
### 1.1 List Rooms 
**GET /api/rooms?type=&start=&end=&detail=**

This API to get all rooms that match the query filter. User can pass start date, end date, room type to filter rooms. 
If user pass **detail** argument and it's value is __true__, response will show all rooms. Other wise, response will show the minimum informations like Traveloka

Examples:

> /api/rooms
```
{
    "success": true,
    "data": [
        {
            "_id": "5b228e27cafba93754f914cb",
            "name": "Standar",
            "price": 500000,
            "photos": [],
            "available": 4
        },
        {
            "_id": "5b228e3dcafba93754f914cc",
            "name": "Double",
            "price": 700000,
            "photos": [],
            "available": 3
        },
        {
            "_id": "5b228e4bcafba93754f914cd",
            "name": "Twin",
            "price": 1000000,
            "photos": [],
            "available": 3
        }
    ]
}
```
> /api/rooms?type=5b228e27cafba93754f914cb&start=1529020800000&end=1529452800000&detail=true
```
{
    "success": true,
    "data": [
        {
            "_id": "5b228f85cafba93754f914ce",
            "roomNumber": "100",
            "type": {
                "_id": "5b228e27cafba93754f914cb",
                "name": "Standar",
                "price": 500000,
                "photos": []
            },
            "description": "description",
            "createdDate": "2018-06-14T15:53:41.020Z",
            "photos": [],
            "__v": 0
        },
        {
            "_id": "5b228f88cafba93754f914cf",
            "roomNumber": "101",
            "type": {
                "_id": "5b228e27cafba93754f914cb",
                "name": "Standar",
                "price": 500000,
                "photos": []
            },
            "description": "description",
            "createdDate": "2018-06-14T15:53:44.698Z",
            "photos": [],
            "__v": 0
        },
        {
            "_id": "5b228f8bcafba93754f914d0",
            "roomNumber": "102",
            "type": {
                "_id": "5b228e27cafba93754f914cb",
                "name": "Standar",
                "price": 500000,
                "photos": []
            },
            "description": "description",
            "createdDate": "2018-06-14T15:53:47.360Z",
            "photos": [],
            "__v": 0
        },
        {
            "_id": "5b228f8fcafba93754f914d1",
            "roomNumber": "103",
            "type": {
                "_id": "5b228e27cafba93754f914cb",
                "name": "Standar",
                "price": 500000,
                "photos": []
            },
            "description": "description",
            "createdDate": "2018-06-14T15:53:51.185Z",
            "photos": [],
            "__v": 0
        }
    ]
}
```

### 1.2 Create Room

**POST /api/rooms**

This API is used for Admin create a Room. This API required **Authorization** Header params, it's value is a Bearer JWT.
Only users with role **admin** can call this API.
The arguments are passed as form-date, with room type's id, room's number, room's description and room's photos.

### 1.3 Edit Room

**PUT /api/rooms/:id**

This API is used for Admin edit a Room. This API required **Authorization** Header params, it's value is a Bearer JWT.
Only users with role **admin** can call this API.
The arguments are passed as form-date, with room type's id, room's number, room's description and room's photos.

### 1.4 Delete Room

**DELETE /api/rooms/:id**

This API is used for Admin delete a Room. This API required **Authorization** Header params, it's value is a Bearer JWT.
Only users with role **admin** can call this API.

### 1.5 Book Rooms

**POST /api/booking**

This API is used for customer book multiple rooms. This API required **Authorization** Header params. 
Client will pass arguments in body, with room type's id, start date, end date, quantity to book. 
System will filter **quantity** free rooms that match the query and create **quantity** booking records with status **new**. 
Each booking record will contains an generated unique code and user's id number to help customer check-in easily. 

### 1.6 Cancel Booking

**PUT /api/booking/:id/cancel**

This API is used for customer cancel a booking. This API required **Authorization** Header params. 
Only booking with status **new** can be canceled. The booking status will become **canceled**


## 2 Bonuses
### 2.1 EDIT Booking

**PUT /api/booking/:id**

This API is used for customer or administrator edit a booking. This API required **Authorization** Header params. 
If the requester is customer, he only call this api before booking's start date.
Client need to call api 1.1 with **detail** param is **true** to list all rooms that match the query. 
Client will pass arguments in body, with room's id, start date, end date to edit booking informations.

### 2.2 API to list all the available rooms for any particular timeframe in the future

API 1.1 does. The idea is find all booking in time frame, get the room ids **(call A)**. After that, find all rooms whose id not in **A**

### 2.3 Support records of changes of the rooms for audit trail

After client call API 1.6 (cancel booking) or 2.1 (edit booking information), System will log a record to EditBooking collection.
This record will containts created date, user id is requester's id, type **customer** or **admin** is requester's role, booking's id, old booking information, new booking information, and an array to store which property changed, old value, new value.

### 2.4 Ensures that no more than one customer book at the same time

By the idea 2.2, the results of API 1.1 will excludes the busy rooms in the time frame. But if client intentionally uses id of busy rooms, System will detect and throw 400 status with message **Room is busy**

## 3.
Because time is limiited, some bugs can not be avoided.

Thanks for reading to this line.


