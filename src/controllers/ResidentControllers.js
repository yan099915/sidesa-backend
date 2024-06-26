module.exports = {
  verification: async (req, res) => {
    try {
      // verify foto_diri foto_ktp foto_kk ktp ktpNumber kkNumber name birthDate birthPlace address religion maritalStatus job rt rw
      console.log(req, "requestnya");
    } catch (error) {
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  },
};
