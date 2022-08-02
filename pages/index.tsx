import dynamic from "next/dynamic";

const Atlas = dynamic(() => import("../components/Atlas"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

const Home = () => {
  return (
    <div>
      <Atlas />
    </div>
  );
};

export default Home;
