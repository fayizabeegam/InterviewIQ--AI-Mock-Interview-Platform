function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-8">

      <h1 className="text-2xl font-bold md:text-4xl">
        {title}
      </h1>

      <p className="mt-2 text-gray-500">
        {subtitle}
      </p>

    </div>
  );
}

export default PageHeader;