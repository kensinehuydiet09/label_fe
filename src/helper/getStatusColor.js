const getStatusColor = (status) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "completed":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "on_hold":
      return "bg-orange-100 text-orange-800 hover:bg-orange-200";
    case "processed":
      return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200";
    case "draft":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default getStatusColor;
