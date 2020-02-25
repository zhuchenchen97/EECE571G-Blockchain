const Hospital = artifacts.require("Hospital");
require('chai')
.use(require('chai-as-promised'))
.should();

contract(Hospital,([deployer, user, user1, user2, user3,user4])=>{
    let hospital;
    before(async () =>{
        hospital = await Hospital.deployed()
    })
    describe('Deployment', async()=>{
        it('The deployment should be done successfully',async() =>{
            const address = await hospital.address
            assert.notEqual(address,0x0)
            assert.notEqual(address,'')
            assert.notEqual(address,null)
            assert.notEqual(address,undefined) 
        })

        it('The deployed smart contract has the correct name', async()=>{
            const name = await hospital.hospitalName();
            assert.equal(name, "Chenchen Zhu Booking System for hospital")
        })
    })

    describe('Creat and cancel appointment', async()=>{
        let result, addressIndices
        
        before(async ()=>{
            result = await hospital.createAppointment('TryPatient', 666666, 571, {from: user})
            addressIndices = await hospital.addressIndices

        })
        it ('Creating appointment should be successful if all correct', async ()=>{
            //SUCCESSFUL

            const event = result.logs[0].args;
            //assert.equal(addressIndices.length,1,'create one node');
            assert.equal(event.doctorId, 666666, 'doctorId is correct');
            assert.equal(event.roomId, 571,'roomId is correct');
            assert.equal(event.patientName, 'TryPatient','patienceName is correct');
            assert.equal(event.itemOwner, user, 'itemOwner is correct');
            assert.equal(event.isBooked, true, 'isBooked is correct');
        })

        it ('Creating appointment should be failed if no patient name or no doctorId or no roomId or doctor/room has been booked', async ()=>{
            //Appointment must have a patience name
            await hospital.createAppointment('', 666666, 571, {from: user1}).should.be.rejected;
            //Appointment must have a positive doctorId
            await hospital.createAppointment('TryPatient', 0, 571 , {from: user1}).should.be.rejected;
            //Appointment must have a positive roomId
            await hospital.createAppointment('TryPatient', 666666 , 0, {from: user1}).should.be.rejected;
            //One user(patient) could only has one appointment
            await hospital.createAppointment('TryPatient1', 211111 , 555, {from: user1});
            await hospital.createAppointment('TryPatient1', 111112 , 556, {from: user1}).should.be.rejected;
            //Appointment must ensure that the doctor and room are available
            await hospital.createAppointment('TryPatient', 111113 , 557, {from: user2});
            await hospital.createAppointment('TryPatient', 111113 , 556, {from: user2}).should.be.rejected;
            await hospital.createAppointment('TryPatient', 111112 , 557, {from: user2}).should.be.rejected;
        })

        it ('Check the appointment created', async ()=>{
            const item = await hospital.appointments(user);
            assert.equal(item.doctorId, 666666, 'doctorId is correct');
            assert.equal(item.roomId, 571,'roomId is correct');
            assert.equal(item.patientName, 'TryPatient','patienceName is correct');
            assert.equal(item.itemOwner, user, 'itemOwner is correct');
            assert.equal(item.isBooked, true, 'isBooked is correct');
        })

        it('Cancel the appointment', async () => {
            // SUCCESS: Buyer makes purchase
            result = await hospital.cancelAppointment({from: user});

            // Check Log
            const event = result.logs[0].args;
            assert.equal(event.doctorId, 666666, 'doctorId is correct');
            assert.equal(event.roomId, 571,'roomId is correct');
            assert.equal(event.patientName, 'TryPatient','patienceName is correct');
            assert.equal(event.itemOwner, user, 'itemOwner is correct');
            assert.equal(event.isBooked, true, 'isBooked is correct');

        })
        it('The patience who does not have appointment should be rejected', async () => {
            // FAILURE: Cannot cancel non-exist appointment
            await hospital.cancelAppointment({from: user3}).should.be.rejected;
        })
    })
});
