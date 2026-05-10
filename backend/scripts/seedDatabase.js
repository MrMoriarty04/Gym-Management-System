require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("../config/db");
const User = require("../models/User");
const CoachProfile = require("../models/CoachProfile");
const TraineeProfile = require("../models/TraineeProfile");
const Subscription = require("../models/Subscription");
const Session = require("../models/session");
const Workout = require("../models/Workout");
const WorkoutRoutine = require("../models/WorkoutRoutine");
const DietPlan = require("../models/DietPlan");
const Diet = require("../models/Diet");
const OtpToken = require("../models/OtpToken");

const addDays = (base, days) => {
  const date = new Date(base);
  date.setDate(date.getDate() + days);
  return date;
};

const runSeed = async () => {
  await connectDB();

  const now = new Date();
  const passwordHash = await bcrypt.hash("Password123!", 10);

  const adminId = new mongoose.Types.ObjectId();
  const coachIds = [
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
  ];
  const traineeIds = [
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
  ];

  try {
    await OtpToken.deleteMany({});
    await Diet.deleteMany({});
    await DietPlan.deleteMany({});
    await WorkoutRoutine.deleteMany({});
    await Workout.deleteMany({});
    await Session.deleteMany({});
    await Subscription.deleteMany({});
    await CoachProfile.deleteMany({});
    await TraineeProfile.deleteMany({});
    await User.deleteMany({});

    const users = [
      {
        _id: adminId,
        name: "Apex Super Admin",
        email: "admin@apex.local",
        password: passwordHash,
        role: "admin",
        isVerified: true,
      },
      {
        _id: coachIds[0],
        name: "Coach Mason Reed",
        email: "coach.mason@apex.local",
        password: passwordHash,
        role: "coach",
        isVerified: true,
      },
      {
        _id: coachIds[1],
        name: "Coach Lina Cruz",
        email: "coach.lina@apex.local",
        password: passwordHash,
        role: "coach",
        isVerified: true,
      },
      {
        _id: coachIds[2],
        name: "Coach Omar Hale",
        email: "coach.omar@apex.local",
        password: passwordHash,
        role: "coach",
        isVerified: true,
      },
      {
        _id: traineeIds[0],
        name: "Trainee Ava Stone",
        email: "ava@apex.local",
        password: passwordHash,
        role: "trainee",
        isVerified: true,
      },
      {
        _id: traineeIds[1],
        name: "Trainee Noah Blake",
        email: "noah@apex.local",
        password: passwordHash,
        role: "trainee",
        isVerified: true,
      },
      {
        _id: traineeIds[2],
        name: "Trainee Mia Grant",
        email: "mia@apex.local",
        password: passwordHash,
        role: "trainee",
        isVerified: true,
      },
      {
        _id: traineeIds[3],
        name: "Trainee Leo Park",
        email: "leo@apex.local",
        password: passwordHash,
        role: "trainee",
        isVerified: true,
      },
      {
        _id: traineeIds[4],
        name: "Trainee Emma Ross",
        email: "emma@apex.local",
        password: passwordHash,
        role: "trainee",
        isVerified: false,
      },
      {
        _id: traineeIds[5],
        name: "Trainee Kai Moore",
        email: "kai@apex.local",
        password: passwordHash,
        role: "trainee",
        isVerified: true,
      },
    ];

    await User.insertMany(users);

    const traineeToCoach = {
      [traineeIds[0]]: coachIds[0],
      [traineeIds[1]]: coachIds[0],
      [traineeIds[2]]: coachIds[1],
      [traineeIds[3]]: coachIds[1],
      [traineeIds[4]]: coachIds[2],
      [traineeIds[5]]: coachIds[2],
    };

    await CoachProfile.insertMany([
      {
        user: coachIds[0],
        specialty: "Strength and Conditioning",
        assignedTrainees: [traineeIds[0], traineeIds[1]],
      },
      {
        user: coachIds[1],
        specialty: "Body Recomposition",
        assignedTrainees: [traineeIds[2], traineeIds[3]],
      },
      {
        user: coachIds[2],
        specialty: "Athletic Performance",
        assignedTrainees: [traineeIds[4], traineeIds[5]],
      },
    ]);

    await TraineeProfile.insertMany(
      traineeIds.map((traineeId, index) => ({
        user: traineeId,
        heightCm: 165 + index * 2,
        weightKg: 62 + index * 3,
        age: 22 + index,
        fitnessGoal:
          index % 2 === 0 ? "Build lean muscle" : "Improve conditioning",
        currentSubscriptionTier: [1, 3, 6, 12, 3, 1][index],
        assignedCoach: traineeToCoach[traineeId],
      })),
    );

    await Subscription.insertMany([
      {
        user: traineeIds[0],
        planType: 3,
        paymentStatus: "paid",
        startDate: addDays(now, -20),
        endDate: addDays(now, 70),
        isActive: true,
      },
      {
        user: traineeIds[1],
        planType: 1,
        paymentStatus: "pending",
        startDate: addDays(now, -2),
        endDate: addDays(now, 28),
        isActive: true,
      },
      {
        user: traineeIds[2],
        planType: 6,
        paymentStatus: "paid",
        startDate: addDays(now, -50),
        endDate: addDays(now, 130),
        isActive: true,
      },
      {
        user: traineeIds[3],
        planType: 12,
        paymentStatus: "paid",
        startDate: addDays(now, -120),
        endDate: addDays(now, 245),
        isActive: true,
      },
      {
        user: traineeIds[4],
        planType: 3,
        paymentStatus: "failed",
        startDate: addDays(now, -10),
        endDate: addDays(now, 80),
        isActive: false,
      },
      {
        user: traineeIds[5],
        planType: 1,
        paymentStatus: "cancelled",
        startDate: addDays(now, -35),
        endDate: addDays(now, -5),
        isActive: false,
      },
    ]);

    await Session.insertMany([
      {
        traineeId: traineeIds[0],
        coachId: coachIds[0],
        date: addDays(now, -1),
        startTime: "08:00",
        endTime: "09:00",
        status: "completed",
        location: "Studio A",
      },
      {
        traineeId: traineeIds[1],
        coachId: coachIds[0],
        date: addDays(now, 1),
        startTime: "10:00",
        endTime: "11:00",
        status: "scheduled",
        location: "Strength Zone",
      },
      {
        traineeId: traineeIds[2],
        coachId: coachIds[1],
        date: addDays(now, 2),
        startTime: "09:30",
        endTime: "10:15",
        status: "scheduled",
        location: "Studio B",
      },
      {
        traineeId: traineeIds[4],
        coachId: coachIds[2],
        date: addDays(now, -3),
        startTime: "18:00",
        endTime: "19:00",
        status: "cancelled",
        location: "Track",
      },
    ]);

    await Workout.insertMany([
      {
        traineeId: traineeIds[0],
        coachId: coachIds[0],
        title: "Upper Body Power",
        date: addDays(now, -1),
        exercises: [
          { name: "Bench Press", sets: 4, reps: 6, notes: "RPE 8" },
          { name: "Barbell Row", sets: 4, reps: 8, notes: "Control tempo" },
        ],
        traineeFeedback: "Felt strong and stable throughout",
      },
      {
        traineeId: traineeIds[2],
        coachId: coachIds[1],
        title: "Lower Body Hypertrophy",
        date: addDays(now, -2),
        exercises: [
          { name: "Back Squat", sets: 5, reps: 5, notes: "Depth focus" },
          {
            name: "Romanian Deadlift",
            sets: 4,
            reps: 8,
            notes: "Hamstrings",
          },
        ],
        traineeFeedback: "Need to improve squat balance",
      },
      {
        traineeId: traineeIds[5],
        coachId: coachIds[2],
        title: "Conditioning Circuit",
        date: addDays(now, -4),
        exercises: [
          { name: "Air Bike", sets: 6, reps: 1, notes: "45 sec intervals" },
          {
            name: "Battle Ropes",
            sets: 6,
            reps: 1,
            notes: "30 sec intervals",
          },
        ],
      },
    ]);

    await WorkoutRoutine.insertMany([
      {
        coachId: coachIds[0],
        traineeId: traineeIds[0],
        dayOfWeek: "monday",
        exerciseList: [
          {
            exerciseName: "Incline Press",
            sets: 4,
            reps: 8,
            notes: "2 min rest",
          },
          {
            exerciseName: "Seated Row",
            sets: 4,
            reps: 10,
            notes: "Pause squeeze",
          },
        ],
      },
      {
        coachId: coachIds[1],
        traineeId: traineeIds[2],
        dayOfWeek: "wednesday",
        exerciseList: [
          {
            exerciseName: "Front Squat",
            sets: 5,
            reps: 5,
            notes: "Bracing",
          },
          {
            exerciseName: "Walking Lunges",
            sets: 3,
            reps: 12,
            notes: "Each leg",
          },
        ],
      },
      {
        coachId: coachIds[2],
        traineeId: traineeIds[5],
        dayOfWeek: "friday",
        exerciseList: [
          { exerciseName: "Sled Push", sets: 6, reps: 1, notes: "Heavy" },
          {
            exerciseName: "Medicine Ball Slams",
            sets: 5,
            reps: 12,
            notes: "Explosive",
          },
        ],
      },
    ]);

    await DietPlan.insertMany([
      {
        coachId: coachIds[0],
        traineeId: traineeIds[0],
        dailyCalories: 2400,
        macros: { protein: 180, carbs: 260, fats: 70 },
        mealBreakdown: [
          {
            mealName: "Breakfast",
            calories: 650,
            protein: 40,
            carbs: 80,
            fat: 18,
            ingredients: ["Oats", "Eggs", "Banana"],
          },
          {
            mealName: "Dinner",
            calories: 850,
            protein: 60,
            carbs: 90,
            fat: 24,
            ingredients: ["Rice", "Chicken", "Avocado"],
          },
        ],
      },
      {
        coachId: coachIds[1],
        traineeId: traineeIds[2],
        dailyCalories: 2100,
        macros: { protein: 155, carbs: 220, fats: 60 },
        mealBreakdown: [
          {
            mealName: "Lunch",
            calories: 700,
            protein: 50,
            carbs: 75,
            fat: 20,
            ingredients: ["Turkey", "Sweet Potato", "Salad"],
          },
        ],
      },
    ]);

    await Diet.insertMany([
      {
        traineeId: traineeIds[0],
        date: addDays(now, -1),
        targetedDiet: {
          calories: 2400,
          protein: 180,
          carbs: 260,
          fat: 70,
        },
        meals: [
          {
            mealName: "Post Workout",
            ingredients: "Whey, oats, berries",
            aiCalculatedCalories: 480,
            aiCalculatedProtein: 38,
            aiCalculatedCarbs: 55,
            aiCalculatedFat: 10,
          },
        ],
        totalConsumed: {
          calories: 2250,
          protein: 170,
          carbs: 240,
          fat: 64,
        },
      },
      {
        traineeId: traineeIds[2],
        date: addDays(now, -1),
        targetedDiet: {
          calories: 2100,
          protein: 155,
          carbs: 220,
          fat: 60,
        },
        meals: [
          {
            mealName: "Dinner",
            ingredients: "Salmon, quinoa, vegetables",
            aiCalculatedCalories: 620,
            aiCalculatedProtein: 42,
            aiCalculatedCarbs: 50,
            aiCalculatedFat: 24,
          },
        ],
        totalConsumed: {
          calories: 1980,
          protein: 148,
          carbs: 205,
          fat: 58,
        },
      },
    ]);

    console.log("Seed completed successfully in a single transaction.");
    console.log("Login credentials (all users): Password123!");
    console.log("Admin: admin@apex.local");
    console.log(
      "Coaches: coach.mason@apex.local, coach.lina@apex.local, coach.omar@apex.local",
    );
    console.log(
      "Trainees: ava@apex.local, noah@apex.local, mia@apex.local, leo@apex.local, emma@apex.local, kai@apex.local",
    );
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

runSeed();
