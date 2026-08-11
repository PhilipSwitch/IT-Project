import app from "./app";

const PORT = process.env.PORT || 3000;

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`SkillLink API running on port ${PORT}`);
});