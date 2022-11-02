using System.Linq.Expressions;

namespace Taskly.Application.Common.Specs;

public class Spec<T> where T : class
{
	private readonly Expression<Func<T, bool>> _expression;

	protected Spec(Expression<Func<T, bool>> expression)
	{
		_expression = expression;
	}

	public bool IsSatisfiedBy(T obj) => _expression.ToLambda()(obj);

	public static Spec<T> operator |(Spec<T> left, Spec<T> right) => new(left._expression.Or(right));
	public static Spec<T> operator &(Spec<T> left, Spec<T> right) => new(left._expression.And(right));

	public static bool operator false(Spec<T> left) => false;

	public static bool operator true(Spec<T> left) => false;

	public static implicit operator Expression<Func<T, bool>>(Spec<T> spec)
	{
		return spec._expression;
	}

	public static implicit operator Spec<T>(Expression<Func<T, bool>> expression)
	{
		return new Spec<T>(expression);
	}
}
