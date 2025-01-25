const AuthSchema = require('../models/auth');
const CarSchema = require('../models/car');

const addFav = async (req, res) => {
    try {
        const { carId, userId } = req.body;

        if (!userId || !carId) {
            return res.status(400).json({ message: "İstifadəçi və ya maşın ID-si çatmır" });
        }

        const user = await AuthSchema.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "İstifadəçi tapılmadı" });
        }

        if (user.favList.includes(carId)) {
            await AuthSchema.updateOne(
                { _id: userId },
                { $pull: { favList: carId } }
            );
            return res.status(200).json({ message: "Maşın favoritlərdən silindi" });
        } else {
            await AuthSchema.updateOne(
                { _id: userId },
                { $addToSet: { favList: carId } }
            );
            return res.status(200).json({ message: "Maşın favoritlərə əlavə edildi" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


const getFavCars = async (req, res) => {
    try {
        const { userId } = req.body
        if (!userId) {
            return res.status(400).json({ message: "İstifadəçi və ya maşın ID-si çatmır" });
        }
        const user = await AuthSchema.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "İstifadəçi tapılmadı" });
        }
        const favCars = await CarSchema.find({ _id: { $in: user.favList } })
        if (favCars.length === 0) {
            return res.status(404).json({ message: "Favorit maşın tapılmadı" });
        }
        res.status(200).json({
            status: "OK",
            favCars
        });
    } catch (error) {

    }
}


module.exports = { addFav, getFavCars };
