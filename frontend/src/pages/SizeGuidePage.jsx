import './InfoPages.css';

export default function SizeGuidePage() {
  return (
    <div className="info-page">
      <div className="info-container">
        <h1 className="info-title">Size Guide</h1>
        <p className="info-subtitle">Find your perfect fit with our size charts below.</p>

        <h2 className="info-section-title">Women's Clothing</h2>
        <table className="size-table">
          <thead>
            <tr><th>Size</th><th>Chest (cm)</th><th>Waist (cm)</th><th>Hips (cm)</th></tr>
          </thead>
          <tbody>
            <tr><td>XS</td><td>78–82</td><td>60–64</td><td>86–90</td></tr>
            <tr><td>S</td><td>83–87</td><td>65–69</td><td>91–95</td></tr>
            <tr><td>M</td><td>88–92</td><td>70–74</td><td>96–100</td></tr>
            <tr><td>L</td><td>93–97</td><td>75–79</td><td>101–105</td></tr>
            <tr><td>XL</td><td>98–102</td><td>80–84</td><td>106–110</td></tr>
          </tbody>
        </table>

        <h2 className="info-section-title">Men's Clothing</h2>
        <table className="size-table">
          <thead>
            <tr><th>Size</th><th>Chest (cm)</th><th>Waist (cm)</th><th>Shoulder (cm)</th></tr>
          </thead>
          <tbody>
            <tr><td>S</td><td>88–92</td><td>74–78</td><td>42–44</td></tr>
            <tr><td>M</td><td>93–97</td><td>79–83</td><td>44–46</td></tr>
            <tr><td>L</td><td>98–102</td><td>84–88</td><td>46–48</td></tr>
            <tr><td>XL</td><td>103–107</td><td>89–93</td><td>48–50</td></tr>
            <tr><td>XXL</td><td>108–112</td><td>94–98</td><td>50–52</td></tr>
          </tbody>
        </table>

        <h2 className="info-section-title">Men's Trousers</h2>
        <table className="size-table">
          <thead>
            <tr><th>Size</th><th>Waist (inches)</th><th>Waist (cm)</th></tr>
          </thead>
          <tbody>
            <tr><td>28</td><td>28"</td><td>71 cm</td></tr>
            <tr><td>30</td><td>30"</td><td>76 cm</td></tr>
            <tr><td>32</td><td>32"</td><td>81 cm</td></tr>
            <tr><td>34</td><td>34"</td><td>86 cm</td></tr>
            <tr><td>36</td><td>36"</td><td>91 cm</td></tr>
          </tbody>
        </table>

        <div className="info-tip">
          <strong>Tip:</strong> If you are between sizes, we recommend sizing up for a more relaxed fit or sizing down for a closer fit.
        </div>
      </div>
    </div>
  );
}