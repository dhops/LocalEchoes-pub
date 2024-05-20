export const getTypeIcon = (type) => {
    switch (type) {
      case 'history':
        return 'castle';
      case 'economy':
        return 'factory';
      case 'culture':
        return 'palette';
      case 'oral-history':
        return 'account-voice';
      case 'nature':
        return 'tree';
      case 'legend':
        return 'auto-stories';
      default:
        return 'information';
    }
  };