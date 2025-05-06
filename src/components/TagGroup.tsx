type TagGroupProps = {
  title: string;
  tags: string[];
  selectedTags: string[];
  onToggle: (tag: string) => void;
  icon?: string;
};

export default function TagGroup({
  title,
  tags,
  selectedTags,
  onToggle,
  icon,
}: TagGroupProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        {icon && <img src={icon} alt="icon" className="w-5 h-5" />}
        <p className="text-left font-GanwonEduAll_Bold text-[20px]">{title}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => onToggle(tag)}
              className={`px-3 py-1.5 text-xs rounded-full border whitespace-nowrap font-GanwonEduAll_Light ${
                isSelected
                  ? 'bg-[#BD4B2C] text-white border-[#BD4B2C]'
                  : 'bg-[##F2F2F2] text-gray-700 border-gray-300'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
