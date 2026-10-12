export default function Button(
    { 
        loading, children, className = '', ...props 
    }
) 
{
     return <button className={'button ' + className} disabled={loading || props.disabled} {...props}>{loading ? 'Please wait...' : children}
     </button>; 
}
