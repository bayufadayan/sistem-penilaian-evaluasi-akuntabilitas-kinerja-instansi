import { PrismaClient, Role, Gender, Status } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      appName: "Eka Prime",
      appLogoLogin: "/images/navbar-flat.svg",
      appLogoDashboard: "/images/nav-logo-main.svg",
      : "/images/footer-logo.svg",
      favicon: "/images/favicon.ico",
      adminEmail: "ekaprime.akip.bpmsph@gmail.com",
      adminMailPass: "lxtwdclvxitqfdhp",
      adminPhone: "85716042693",
      guideLink:
        "https://drive.google.com/file/d/1coCWbbDnbF9qgk_tFUp-cRIrwP_Ko7Os/view?usp=drive_link",
    },
  });

  console.log("Settings seeded.");

  const generalTeam = await prisma.team.upsert({
    where: { name: "General" },
    update: {},
    create: {
      name: "General",
    },
  });

  console.log("Team seeded:", generalTeam);

  const users = [
    {
      email: "admin@gmail.com",
      password: bcrypt.hashSync("admin12345", 10),
      nip: BigInt("1234567890123456"),
      name: "Admin AKIP",
      role: Role.ADMIN,
      gender: Gender.FEMALE,
      status: Status.INACTIVE,
      id_team: generalTeam.id,
    },
    {
      email: "bayufadayan@gmail.com",
      password: bcrypt.hashSync("12345678", 10),
      nip: BigInt("2345678901234567"),
      name: "Bayu Fadayan",
      role: Role.ADMIN,
      gender: Gender.MALE,
      status: Status.ACTIVE,
      id_team: generalTeam.id,
    },
    {
      email: "user@example.com",
      password: bcrypt.hashSync("user1234", 10),
      nip: BigInt("3456789012345678"),
      name: "User Example",
      role: Role.USER,
      gender: Gender.MALE,
      status: Status.ACTIVE,
      id_team: generalTeam.id,
    },
  ];

  for (const user of users) {
    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
    console.log("User seeded:", createdUser);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
