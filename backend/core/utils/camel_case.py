import re


__all__ = [
    'convert_keys_to_camel_case',
    'convert_key_to_camel_case',
    'convert_keys_to_snake_case',
    'convert_key_to_snake_case',
]


def convert_key_to_camel_case(snake_str):
    components = snake_str.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])


def convert_keys_to_camel_case(data):
    if isinstance(data, list):
        return [convert_keys_to_camel_case(item) for item in data]
    elif isinstance(data, dict):
        return {convert_key_to_camel_case(key): convert_keys_to_camel_case(value) for key, value in data.items()}
    return data


def convert_key_to_snake_case(camel_str):
    camel_to_snake_pattern = re.compile(r'(?<!^)(?=[A-Z])')
    return camel_to_snake_pattern.sub('_', camel_str).lower()


def convert_keys_to_snake_case(data):
    if isinstance(data, list):
        return [convert_keys_to_snake_case(item) for item in data]
    elif isinstance(data, dict):
        return {convert_key_to_snake_case(key): convert_keys_to_snake_case(value) for key, value in data.items()}
    return data
