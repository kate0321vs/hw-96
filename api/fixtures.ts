import mongoose from "mongoose";
import config from "./config";
import User from "./models/User";
import Cocktail from "./models/Cocktail";

const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection("users");
        await db.dropCollection("cocktails");
    } catch (e) {
        console.log("Collections were not present, skipping drop...");
    }

    const [User1, User2, User3] = await User.create({
        email: "user1@gmail.com",
        password: "password",
        role: "user",
        displayName: "John",
        token: crypto.randomUUID(),
        avatar: 'fixtures/user_avatar.jpg'
    }, {
        email: "user2@gmail.com",
        password: "password",
        role: "user",
        displayName: "Kate",
        token: crypto.randomUUID(),
        avatar: 'fixtures/user2_avatar.jpg'
    }, {
        email: "admin@gmail.com",
        password: "password",
        role: "admin",
        displayName: "Jane",
        token: crypto.randomUUID(),
        avatar: 'fixtures/admin_avatar.jpg'
    });

    await Cocktail.create({
        name: "Margarita",
        user: User1,
        recipe: 'Rub the rim of a glass with a lime wedge and dip it in salt (optional).Fill a shaker with 1 cup of ice.Add 2 oz tequila, 1 oz lime juice, and 1 oz triple sec. Shake well and strain into the prepared glass filled with fresh ice (optional).Garnish with the lime wedge. Enjoy!',
        image: "fixtures/margarita.jpg",
        isPublished: false,
        ingredients: [
            {name: "Tequila", quantity: "2 oz"},
            {name: "Lime juice (freshly squeezed)", quantity: "1 oz"},
            {name: "Triple sec (e.g., Cointreau)", quantity: "1 oz"},
            {name: "Triple sec (e.g., Cointreau)", quantity: "1 oz"},
            {name: "Ice", quantity: "1 cup"},
            {name: "Salt", quantity: "1 tsp"},
            {name: "Lime", quantity: "1 wedge"}
        ]
    }, {
        name: "Aperol Spritz",
        user: User1,
        recipe: 'Fill a wine glass with ice. Add 3 oz Prosecco, 2 oz Aperol, and 1 oz soda water. Stir gently to combine. Garnish with an orange slice. Cheers!',
        image: "fixtures/aperol.jpg",
        isPublished: true,
        ingredients: [
            {name: "Prosecco", quantity: "3 oz"},
            {name: "Aperol", quantity: "2 oz"},
            {name: "Soda water (club soda)", quantity: "1 oz"},
            {name: "Ice", quantity: "1 oz"},
            {name: "Orange", quantity: "1 slice"}
        ]
    }, {
        name: "Gin & Tonic",
        user: User1,
        recipe: 'Fill a highball glass with ice. Pour in 2 oz gin. Top with 4 oz tonic water. Stir gently. Garnish with a lime wedge or cucumber slice. Enjoy!',
        image: "fixtures/GinTonic.jpg",
        isPublished: true,
        ingredients: [
            {name: "Gin", quantity: "2 oz"},
            {name: "Tonic water", quantity: "4 oz"},
            {name: "Ice", quantity: "1 oz"},
            {name: "Lime", quantity: "1 slice"}
        ]
    }, {
        name: "Daiquiri",
        user: User2,
        recipe: 'Fill a shaker with ice. Add 2 oz white rum, 1 oz lime juice, and 0.75 oz simple syrup. Shake well until chilled. Strain into a chilled cocktail or coupe glass. Garnish with a lime wheel (optional). Cheers!',
        image: "fixtures/Daiquiri.jpg",
        isPublished: false,
        ingredients: [
            {name: "White rum", quantity: "2 oz"},
            {name: "Fresh lime juice", quantity: "1 oz"},
            {name: "Simple syrup", quantity: "0.75 oz"},
            {name: "Ice", quantity: "1 oz"},
            {name: "Lime", quantity: "1 slice"}
        ]
    }, {
        name: "Cuba Libre",
        user: User2,
        recipe: 'Fill a shaker with ice. Add 2 oz white rum, 1 oz lime juice, and 0.75 oz simple syrup. Shake well until chilled. Strain into a chilled cocktail or coupe glass. Garnish with a lime wheel (optional). Cheers!',
        image: "fixtures/CubaLibre.jpg",
        isPublished: true,
        ingredients: [
            {name: "White rum", quantity: "2 oz"},
            {name: "Cola", quantity: "4 oz"},
            {name: "Fresh lime juice", quantity: "0.5 oz"},
            {name: "Ice", quantity: "1 oz"},
            {name: "Lime", quantity: "1 slice"}
        ]
    }, {
        name: "Mai Tai ",
        user: User2,
        recipe: 'Fill a shaker with ice. Add white rum, lime juice, orange curaçao, and orgeat syrup. Shake well and strain into a glass filled with fresh ice. Float the dark rum on top by pouring it gently over the back of a spoon. Garnish with a mint sprig or lime wheel. Cheers!',
        image: "fixtures/MaiTai.jpg",
        isPublished: true,
        ingredients: [
            {name: "White rum", quantity: "1 oz"},
            {name: "Dark rum", quantity: "1 oz"},
            {name: "Fresh lime juice", quantity: "0.75 oz"},
            {name: "Orange curaçao", quantity: "0.5 oz"},
            {name: "Orgeat syrup ", quantity: "0.25 oz"},
            {name: "Ice", quantity: "1 oz"},
            {name: "Lime", quantity: "1 slice"}
        ]
    });

    await db.close()
};

run().catch(console.error);