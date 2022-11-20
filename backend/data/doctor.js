const helper = require("../helper");
const mongoCollections = require("../config/mongoCollections");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const doctorCol = mongoCollections.doctor;
const { ObjectId } = require("mongodb");

const createDoctor = async (
  email,
  profilePicture,
  name,
  specialty,
  clinicAddress,
  city,
  state,
  zip,
  password,
  schedule
) => {
  email = helper.common.isValidEmail(email);
  profilePicture = helper.common.isValidFilePath(profilePicture);
  name = helper.common.isValidName(name);
  specialty = helper.doctor.isValidSpecialty(specialty);
  clinicAddress = helper.doctor.isValidAddress(clinicAddress);
  city = helper.common.isValidCity(city);
  state = helper.common.isValidState(state);
  zip = helper.common.isValidZip(zip);
  password = helper.common.isValidPassword(password);
  schedule = helper.doctor.isValidSchedule(schedule);

  const doctorCollection = await doctorCol();
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newDoctor = {
    email,
    profilePicture,
    name,
    specialty,
    clinicAddress,
    city,
    state,
    zip,
    hashedPassword,
    schedule,
    rating: 0,
  };

  const insertInfo = await doctorCollection.insertOne(newDoctor);

  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw { status: "500", error: "Could not add doctor" };

  const newId = insertInfo.insertedId.toString();
  const doctor = await getDoctorById(newId);

  return doctor;
};

const getDoctorById = async (doctorId) => {
  doctorId = helper.common.isValidId(doctorId);

  const doctorCollection = await doctorCol();
  const doctor = await doctorCollection.findOne(
    { _id: ObjectId(doctorId) },
    { projection: { hashedPassword: 0 } }
  );

  if (doctor === null) {
    throw { status: "404", error: "No doctor with that id" };
  }

  doctor._id = doctor._id.toString();

  return doctor;
};

const getAllDoctor = async () => {
  const doctorCollection = await doctorCol();
  const allDoctors = await doctorCollection
    .find({}, { projection: { hashedPassword: 0, schedule: 0 } })
    .toArray();

  if (!allDoctors) throw { status: "500", error: "Could not get all doctors" };

  for (let i = 0; i < allDoctors.length; i++)
    allDoctors[i]._id = allDoctors[i]._id.toString();

  return allDoctors;
};

const updateDoctor = async (doctorId, data) => {
  doctorId = helper.common.isValidId(doctorId);
  data = helper.doctor.isValidDoctorData(data);

  const doctorCollection = await doctorCol();

  await getDoctorById(doctorId);

  if (data.password) {
    data.hashedPassword = await bcrypt.hash(data.password, saltRounds);
    delete data.password;
  }

  const updatedInfo = await doctorCollection.updateOne(
    { _id: ObjectId(doctorId) },
    { $set: data }
  );

  if (updatedInfo.modifiedCount === 0) {
    throw { status: "400", error: "could not update doctor successfully" };
  }

  const doctor = await getDoctorById(doctorId);
  return doctor;
};



module.exports = {
  createDoctor,
  getDoctorById,
  getAllDoctor,
  updateDoctor,
};
