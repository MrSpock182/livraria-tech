export default function Colabe() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-start pt-10 px-4">
      <h1 className="text-4xl font-bold text-white mb-6">Lindo</h1>

      <div className="w-full max-w-md h-[70vh] flex justify-center items-center overflow-hidden rounded shadow-lg">
        <img
          src="/img/lindo.jpeg"
          alt="Lindo"
          className="object-contain h-full w-full"
        />
      </div>
    </div>
  );
}