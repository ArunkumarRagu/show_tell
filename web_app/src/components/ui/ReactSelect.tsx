import Select, { Props as SelectProps, GroupBase, StylesConfig } from 'react-select';

export interface OptionType<T = string | number> {
  value: T;
  label: string;
  [key: string]: any;
}

export interface CustomReactSelectProps<
  Option = OptionType,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
> extends SelectProps<Option, IsMulti, Group> {
  className?: string;
}

const customStyles: StylesConfig<any, any, any> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: '#0B1020',
    borderColor: state.isFocused ? '#7C3AED' : '#26324A',
    borderRadius: '0.75rem',
    minHeight: '42px',
    padding: '0 4px',
    color: '#F8FAFC',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(124, 58, 237, 0.2)' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#7C3AED' : '#3b4d71',
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#151E33',
    borderColor: '#26324A',
    borderWidth: '1px',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
    overflow: 'hidden',
    zIndex: 9999,
  }),
  menuList: (base) => ({
    ...base,
    padding: '6px',
    backgroundColor: '#151E33',
    borderRadius: '0.75rem',
    '::-webkit-scrollbar': {
      width: '6px',
    },
    '::-webkit-scrollbar-thumb': {
      background: '#26324A',
      borderRadius: '9999px',
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? '#7C3AED'
      : state.isFocused
      ? '#1C2742'
      : 'transparent',
    color: state.isSelected ? '#FFFFFF' : '#F8FAFC',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    padding: '8px 12px',
    margin: '2px 0',
    transition: 'all 0.15s ease',
    '&:active': {
      backgroundColor: state.isSelected ? '#7C3AED' : '#26324A',
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: '#F8FAFC',
    fontSize: '0.875rem',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#1C2742',
    borderRadius: '0.375rem',
    border: '1px solid #26324A',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#F8FAFC',
    fontSize: '0.8125rem',
    padding: '2px 6px',
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: '#94A3B8',
    borderRadius: '0 0.375rem 0.375rem 0',
    '&:hover': {
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      color: '#EF4444',
    },
  }),
  input: (base) => ({
    ...base,
    color: '#F8FAFC',
    fontSize: '0.875rem',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#64748B',
    fontSize: '0.875rem',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? '#7C3AED' : '#64748B',
    padding: '6px',
    transition: 'color 0.15s ease',
    '&:hover': {
      color: '#F8FAFC',
    },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: '#64748B',
    padding: '6px',
    '&:hover': {
      color: '#EF4444',
    },
  }),
  // Ensure portaled menus always render above modals (z-50 = 50)
  menuPortal: (base) => ({
    ...base,
    zIndex: 99999,
  }),
};

export function ReactSelect<
  Option = OptionType,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: CustomReactSelectProps<Option, IsMulti, Group>) {
  const { styles, className, ...rest } = props;

  return (
    <Select<Option, IsMulti, Group>
      styles={{
        ...customStyles,
        ...styles,
      }}
      className={className}
      {...rest}
    />
  );
}

export default ReactSelect;
