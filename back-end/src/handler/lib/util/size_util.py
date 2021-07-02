class Unit:
    def __init__(self, name: str, value: int) -> None:
        self.name = name
        self.value = value

def human_readable(precision: int = 2, byte: int = 0, kb: int = 0, mb: int = 0, gb: int = 0) -> str:
    '''
    Convert size to human readable string
    '''

    units = [ Unit('BYTE', byte), Unit('KB', kb), Unit('MB', mb), Unit('GB', gb)]

    for u1, u2 in zip(units, units[1:]):
        u2.value += u1.value // 1024
        u1.value %= 1024
    
    units = units[::-1]
    for u1, u2 in zip(units, units[1:]):
        if u1.value:
            return f"{u1.value}{'.'+ str(u2.value)[:precision] if u2.value else ''} {u1.name}"
    return '0 BYTE'