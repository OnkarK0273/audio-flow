function BgDecorative() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/10 blur-[130px] rounded-full" />
      <div className="absolute top-1/3 -left-40 w-[450px] h-[450px] bg-purple-600/10 blur-[130px] rounded-full" />
      <div className="absolute bottom-10 -right-40 w-[500px] h-[450px] bg-rose-600/10 blur-[140px] rounded-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f0a_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    </div>
  );
}

export default BgDecorative;
