pragma solidity >=0.4.21 <0.7.0;

contract Hospital {
    string public hospitalName;
    address payable patienceAddress;
    address[] public addressIndices;

    struct Appointment {
        uint doctorId;
        uint roomId;
        string patientName;
        address payable itemOwner;
        bool isBooked;
    }

    mapping(address => Appointment) public appointments;

       //events
    event appointment(  //it's () and ,   !!!!
        uint doctorId,
        uint roomId,
        string patientName,
        address payable itemOwner,
        bool isBooked
    );

    event cancel(
        uint doctorId,
        uint roomId,
        string patientName,
        address payable itemOwner,
        bool isBooked
    );

    constructor() public {
        hospitalName = "Chenchen Zhu Booking System for hospital";
    }

    //functions

    //createItem
    function createAppointment(string memory _patienceName, uint _doctorId, uint _roomId) public {
        patienceAddress = msg.sender;
        for(uint i = 0; i<addressIndices.length; i++){
            require(appointments[addressIndices[i]].doctorId!=_doctorId, "This doctor has been booked!");
            require(appointments[addressIndices[i]].roomId!=_roomId, "This room has been booked!");
        }
        require(bytes(_patienceName).length > 0, "Patience's name is required!");
        require(_doctorId > 0, "Please input the correct doctorId");
        require(_roomId > 0, "Please input the correct roomId");
        require(appointments[patienceAddress].isBooked != true, "The patient already has appointment");
        appointments[patienceAddress] = Appointment(_doctorId, _roomId, _patienceName, patienceAddress, true);
        addressIndices.push(patienceAddress);
        //addressIndices[addressIndices.length] = patienceAddress;
        emit appointment(_doctorId, _roomId, _patienceName, patienceAddress, true);
    }

    //use memory when don't know abou the size of the argument
    //can also use storage and it can save transation fee

    //buyItem
    function cancelAppointment() public {
        patienceAddress = msg.sender;
        Appointment memory item = appointments[patienceAddress];
        require(item.isBooked==true, "The patience does not have appointment");
        emit cancel(item.doctorId, item.roomId, item.patientName, item.itemOwner, true);
        for(uint i = 0; i<addressIndices.length; i++){
            if(addressIndices[i] == patienceAddress){
                delete addressIndices[i];
                break;
            }
        }
        delete appointments[patienceAddress];
    }
}