import { CloseButton, Input, InputGroup, type InputProps } from '@chakra-ui/react';
import { useEffect, useImperativeHandle, useRef, useState, type RefAttributes } from 'react';
import { FaSearch } from 'react-icons/fa';

export type SearchInputProps = InputProps & RefAttributes<HTMLInputElement>;

export default function SearchInput({ ref, value, onChange, ...props }: SearchInputProps) {
  const innerRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => innerRef.current!, []);
  const [innerValue, setInnerValue] = useState(props.defaultValue ?? '');

  useEffect(() => {
    setInnerValue(value ?? '');
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    setInnerValue(event.currentTarget.value);
  };

  const clear = () => {
    setInnerValue('');
    setTimeout(() => {
      onChange?.({ currentTarget: innerRef.current, target: innerRef.current } as React.ChangeEvent<HTMLInputElement>);
    });
  };

  return (
    <InputGroup startElement={<FaSearch />} endElement={!!innerValue && <CloseButton onClick={clear} size="sm" />}>
      <Input ref={innerRef} value={innerValue} onChange={handleChange} {...props} />
    </InputGroup>
  );
}
