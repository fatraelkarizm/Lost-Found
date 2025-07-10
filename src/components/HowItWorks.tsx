import { Search, Upload, MessageCircle, CheckCircle } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: "Post Your Item",
      description:
        "Found something? Upload photos and details to help reunite items with their owners.",
      step: "01",
    },
    {
      icon: Search,
      title: "Search & Browse",
      description:
        "Lost something? Use our advanced search filters to find your missing items quickly.",
      step: "02",
    },
    {
      icon: MessageCircle,
      title: "Connect & Communicate",
      description:
        "Comment on posts, contact finders, and coordinate the safe return of items.",
      step: "03",
    },
    {
      icon: CheckCircle,
      title: "Successful Reunion",
      description:
        "Celebrate when items are reunited with their rightful owners in our community.",
      step: "04",
    },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple steps to reunite with your lost items and help others find
            theirs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center group">
              <div className="flex flex-col items-center">
                <div className="relative flex flex-col justify-center items-center">
                  {/* Step */}
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-lg">
                      {step.step}
                    </span>
                  </div>
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-700 transition-colors">
                    <step.icon className="w-8 h-8 text-blue-500" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
